# Dockerfile for Laravel + Vite React development environment
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    NODE_VERSION=18 \
    PHP_VERSION=8.2

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    supervisor \
    netcat \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Add PHP repository and install PHP 8.2-fpm
RUN apt-get update \
    && apt-get install -y software-properties-common \
    && add-apt-repository ppa:ondrej/php \
    && apt-get update \
    && apt-get install -y \
        php8.2-fpm \
        php8.2-cli \
        php8.2-common \
        php8.2-mbstring \
        php8.2-xmlrpc \
        php8.2-soap \
        php8.2-mysql \
        php8.2-gd \
        php8.2-xml \
        php8.2-intl \
        php8.2-bcmath \
        php8.2-zip \
        php8.2-exif \
        php8.2-pcntl \
        php8.2-curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js v18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Create symbolic links for php
RUN ln -s /usr/bin/php8.2 /usr/bin/php

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader

# Install Node.js dependencies
RUN npm install

# Configure PHP-FPM
RUN sed -i 's/listen = \/run\/php\/php8.2-fpm.sock/listen = 0.0.0.0:9000/' /etc/php/8.2/fpm/pool.d/www.conf
RUN sed -i 's/;clear_env = no/clear_env = no/' /etc/php/8.2/fpm/pool.d/www.conf

# Create log directory for supervisor
RUN mkdir -p /var/log/supervisor

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose ports
EXPOSE 9000 3000

# Start services
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]