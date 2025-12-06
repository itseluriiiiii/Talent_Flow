# Animated Gradient Background Guide

A modern, smooth animated gradient background using aesthetic colors with smooth transitions and no flickering.

## Color Palette

- **#FBFBFB** - Light off-white
- **#CDC1FF** - Soft lavender
- **#A294F9** - Vibrant purple
- **#1B1833** - Deep navy (text color)

## Features

✨ **Smooth Animation** - 15-second cycle with ease-in-out timing
🎨 **Modern Colors** - Carefully selected aesthetic palette
🚫 **No Flickering** - Optimized gradient positions
📱 **Fully Responsive** - Works on all screen sizes
♿ **Accessible** - High contrast text color

## Implementation Options

### Option 1: React with CSS (Recommended)

#### Setup

1. Import the gradient background component in your layout:

```tsx
import GradientBackground from '@/components/GradientBackground';

export default function Layout() {
  return (
    <>
      <GradientBackground />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </>
  );
}
```

2. The CSS file (`src/styles/gradient-background.css`) is automatically imported by the component.

3. All text elements will automatically use the color `#1b1833` for proper contrast.

#### File Structure

```
src/
├── components/
│   └── GradientBackground.tsx
├── styles/
│   └── gradient-background.css
└── pages/
    └── GradientShowcase.tsx (example page)
```

### Option 2: React with Tailwind

Use the `GradientBackgroundTailwind` component:

```tsx
import GradientBackgroundTailwind from '@/components/GradientBackgroundTailwind';

export default function Layout() {
  return (
    <>
      <GradientBackgroundTailwind />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </>
  );
}
```

The Tailwind config has been updated with the `animate-gradient-shift` animation.

### Option 3: Plain HTML/CSS

Open `public/gradient-showcase.html` in your browser for a standalone version.

Or copy the CSS directly:

```css
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

body {
  background: linear-gradient(135deg, #fbfbfb 0%, #cdc1ff 50%, #a294f9 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease-in-out infinite;
  min-height: 100vh;
}
```

## Customization

### Change Animation Speed

In `src/styles/gradient-background.css`, modify the animation duration:

```css
animation: gradientShift 20s ease-in-out infinite; /* Change 15s to desired duration */
```

Or in Tailwind config:

```ts
"gradient-shift": "gradient-shift 20s ease-in-out infinite",
```

### Change Colors

Update the gradient in `src/styles/gradient-background.css`:

```css
background: linear-gradient(
  135deg,
  #your-color-1 0%,
  #your-color-2 50%,
  #your-color-3 100%
);
```

### Change Text Color

Update the color in the CSS file:

```css
h1, h2, h3, h4, h5, h6, p, span, div, button, a {
  color: #your-text-color;
}
```

### Change Gradient Direction

Modify the angle in the gradient:

```css
background: linear-gradient(
  45deg,  /* Change angle: 0deg (left-right), 90deg (top-bottom), 135deg (diagonal), etc. */
  #fbfbfb 0%,
  #cdc1ff 50%,
  #a294f9 100%
);
```

## Usage Examples

### Example 1: Full-Page Background

```tsx
import GradientBackground from '@/components/GradientBackground';

export default function HomePage() {
  return (
    <>
      <GradientBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome</h1>
      </div>
    </>
  );
}
```

### Example 2: With Cards and Content

```tsx
import GradientBackground from '@/components/GradientBackground';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <GradientBackground />
      <div className="relative z-10 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            {/* Card content */}
          </Card>
        </div>
      </div>
    </>
  );
}
```

### Example 3: With Navigation

```tsx
import GradientBackground from '@/components/GradientBackground';
import Navigation from '@/components/Navigation';

export default function Layout() {
  return (
    <>
      <GradientBackground />
      <div className="relative z-10">
        <Navigation />
        <main className="p-8">
          {/* Page content */}
        </main>
      </div>
    </>
  );
}
```

## Best Practices

1. **Always use `relative z-10`** on content containers to ensure they appear above the background
2. **Use semi-transparent cards** (`bg-white/80`) for better readability over the gradient
3. **Add backdrop blur** to cards for a modern glass-morphism effect
4. **Test text contrast** to ensure readability on all gradient positions
5. **Use the provided text color** (`#1b1833`) for consistency

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE 11: ⚠️ No animation support (static gradient)

## Performance

- **GPU Accelerated**: Uses CSS animations for smooth 60fps performance
- **Lightweight**: No JavaScript required
- **Optimized**: Minimal repaints and reflows

## Troubleshooting

### Background not showing

- Ensure `GradientBackground` component is placed before content
- Check that content has `relative z-10` class
- Verify CSS file is imported

### Text not visible

- Ensure text color is set to `#1b1833`
- Use semi-transparent backgrounds for cards
- Add backdrop blur for better contrast

### Animation stuttering

- Check browser hardware acceleration is enabled
- Reduce animation duration if needed
- Clear browser cache

## Files Included

- `src/components/GradientBackground.tsx` - React component (CSS-based)
- `src/components/GradientBackgroundTailwind.tsx` - React component (Tailwind-based)
- `src/styles/gradient-background.css` - CSS animations and styles
- `src/pages/GradientShowcase.tsx` - Example React page
- `public/gradient-showcase.html` - Standalone HTML/CSS example
- `tailwind.config.ts` - Updated with gradient animation

## License

Free to use and modify for any project.
