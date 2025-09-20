/**
 * Mock User Service
 * Simulates API calls for user management
 */

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    role: 'مدير',
    status: 'نشط',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    avatar: '/default-avatar.png',
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: 2,
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '+966501234568',
    role: 'مشرف',
    status: 'نشط',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    avatar: '/default-avatar.png',
    createdAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: 3,
    name: 'محمد خالد',
    email: 'mohammed@example.com',
    phone: '+966501234569',
    role: 'مستخدم',
    status: 'غير نشط',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    avatar: '/default-avatar.png',
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: 4,
    name: 'نورة عبدالله',
    email: 'nora@example.com',
    phone: '+966501234570',
    role: 'مستخدم',
    status: 'موقوف',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    avatar: '/default-avatar.png',
    createdAt: new Date(2023, 1, 5).toISOString(),
  },
  {
    id: 5,
    name: 'فهد سليمان',
    email: 'fahad@example.com',
    phone: '+966501234571',
    role: 'مشرف',
    status: 'نشط',
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    avatar: '/default-avatar.png',
    createdAt: new Date(2023, 0, 30).toISOString(),
  },
];

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUserService = {
  /**
   * Get paginated list of users with filtering and sorting
   */
  async getUsers({ search, status, role, page = 1, limit = 10 }) {
    // Simulate network delay
    await delay(500);
    
    // Filter users
    let filteredUsers = [...mockUsers];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(search)
      );
    }
    
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter((user) => {
        if (status === 'active') return user.status === 'نشط';
        if (status === 'inactive') return user.status === 'غير نشط';
        if (status === 'suspended') return user.status === 'موقوف';
        return true;
      });
    }
    
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter((user) => {
        if (role === 'admin') return user.role === 'مدير';
        if (role === 'supervisor') return user.role === 'مشرف';
        if (role === 'user') return user.role === 'مستخدم';
        return true;
      });
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      data: paginatedUsers,
      pagination: {
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    };
  },
  
  /**
   * Get a single user by ID
   */
  async getUserById(userId) {
    await delay(300);
    
    const user = mockUsers.find((u) => u.id === parseInt(userId, 10));
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    return {
      success: true,
      data: { ...user },
    };
  },
  
  /**
   * Create a new user
   */
  async createUser(userData) {
    await delay(700);
    
    // Validate required fields
    if (!userData.name || !userData.email) {
      const error = new Error('Name and email are required');
      error.status = 400;
      error.data = {
        errors: {
          name: !userData.name ? 'Name is required' : undefined,
          email: !userData.email ? 'Email is required' : undefined,
        },
      };
      throw error;
    }
    
    // Check if email already exists
    if (mockUsers.some((u) => u.email === userData.email)) {
      const error = new Error('Email already exists');
      error.status = 400;
      error.data = {
        errors: {
          email: 'Email already in use',
        },
      };
      throw error;
    }
    
    // Create new user
    const newUser = {
      id: Math.max(...mockUsers.map((u) => u.id), 0) + 1,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'مستخدم',
      status: 'نشط',
      lastActive: new Date().toISOString(),
      avatar: '/default-avatar.png',
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, this would be saved to a database
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: newUser,
      message: 'User created successfully',
    };
  },
  
  /**
   * Update an existing user
   */
  async updateUser(userId, userData) {
    await delay(600);
    
    const userIndex = mockUsers.findIndex((u) => u.id === parseInt(userId, 10));
    
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    // Check if email is being updated to an existing email
    if (
      userData.email &&
      mockUsers.some((u, index) => u.email === userData.email && index !== userIndex)
    ) {
      const error = new Error('Email already exists');
      error.status = 400;
      error.data = {
        errors: {
          email: 'Email already in use',
        },
      };
      throw error;
    }
    
    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      id: parseInt(userId, 10), // Ensure ID doesn't change
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    };
  },
  
  /**
   * Delete a user
   */
  async deleteUser(userId) {
    await delay(400);
    
    const userIndex = mockUsers.findIndex((u) => u.id === parseInt(userId, 10));
    
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    // In a real app, this would be deleted from the database
    mockUsers.splice(userIndex, 1);
    
    return {
      success: true,
      message: 'User deleted successfully',
    };
  },
  
  /**
   * Update user status
   */
  async updateUserStatus(userId, isActive) {
    await delay(500);
    
    const userIndex = mockUsers.findIndex((u) => u.id === parseInt(userId, 10));
    
    if (userIndex === -1) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    mockUsers[userIndex].status = isActive ? 'نشط' : 'غير نشط';
    
    return {
      success: true,
      data: mockUsers[userIndex],
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    };
  },
};

export default mockUserService;
