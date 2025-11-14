# LoadingSpinner Component

A professional loading animation using the blue symbol from the "رؤى" logo.

## Features

- Smooth 360-degree rotation animation
- Uses original logo colors (cyan to blue gradient)
- Multiple size options
- Lightweight and reusable
- Professional tech company style

## Installation

The component is already included in the project. Simply import it where needed:

```jsx
import LoadingSpinner from './ui/LoadingSpinner';
```

## Usage

### Basic Usage

```jsx
<LoadingSpinner />
```

### With Size Options

```jsx
<LoadingSpinner size="sm" />  // Small
<LoadingSpinner size="md" />  // Medium (default)
<LoadingSpinner size="lg" />  // Large
<LoadingSpinner size="xl" />  // Extra Large
```

### With Custom Classes

```jsx
<LoadingSpinner className="my-4" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | string | 'md' | Size of the spinner ('sm', 'md', 'lg', 'xl') |
| className | string | '' | Additional CSS classes to apply |

## Animation Details

- **Duration**: 1.5 seconds for a full rotation
- **Timing Function**: `cubic-bezier(0.22, 0.61, 0.36, 1)` for smooth movement
- **Shadow**: Light drop shadow for depth
- **Loop**: Continuous, seamless rotation

## Testing

To test the component, navigate to `/test-loading` in your browser.

## Implementation Notes

The spinner uses the actual blue elements from the "رؤى" logo SVG:
1. Main blue shape
2. Additional blue elements from the logo

The gradient is defined directly in the SVG for maximum compatibility.