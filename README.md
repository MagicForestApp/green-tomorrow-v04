# Magic Forest Conservation Fundraising Landing Page

A premium, visually stunning single-screen fundraising landing page for forest conservation with dark monochrome styling and futuristic elements.

## Features

- **Immersive Visual Design**: Dark theme with subtle forest patterns and animated gradients
- **Interactive Progress Bar**: Shows current fundraising progress with visual feedback
- **Multi-step Donation Flow**: Guided experience for donors with clear steps
- **Responsive Design**: Optimized for all device sizes (mobile, tablet, desktop)
- **Micro-animations**: Subtle animations and transitions for an engaging experience
- **Accessibility Focused**: Proper keyboard navigation and screen reader support

## Technical Implementation

This project is built with:

- **React**: Modern functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: For fluid animations and transitions
- **Headless UI**: For accessible UI components (dialog, transitions)
- **Glass-morphism Effects**: For a modern, premium feel

## Application Structure

- **Landing Screen**: Displays headline, progress information, and action buttons
- **Donation Modal**: Multi-step process for completing donations:
  1. Choose donation type (one-time or monthly)
  2. Select amount or enter custom amount 
  3. Enter optional email and review payment options
  4. Confirmation and receipt

## Development

### Local Development

To start the development server:

```bash
cd frontend
yarn start
```

### Project Structure

- `/frontend/src/App.js`: Main application component
- `/frontend/src/App.css`: Custom CSS styles
- `/frontend/src/index.css`: Global styles and Tailwind utilities
- `/frontend/tailwind.config.js`: Tailwind CSS configuration

## Design Elements

- **Typography**: Bold, sans-serif fonts (Montserrat for display, Inter for body text)
- **Color Palette**: 
  - Forest greens (#349C34 primary)
  - Dark monochrome background (#0D0D13)
  - White text with varied opacity for hierarchy
- **Interactive Elements**:
  - Glowing buttons on hover
  - Transitioning progress bar
  - Glass-morphism for UI components

## User Flow

1. Visitor lands on page and sees current fundraising progress
2. User clicks "DONATE NOW" button
3. User progresses through donation steps
4. Success confirmation appears after donation
5. Progress bar updates to reflect new total

## Additional Considerations

- **Performance**: Optimized for fast loading with minimal dependencies
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Animation**: Subtle, purposeful animations that enhance UX without distraction
