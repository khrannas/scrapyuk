# Design System Proposal (MVP)

The primary goal of this design system is to create an interface that is calm, focused, and low-strain for the eyes during long work sessions.

## Color Palette (Dark Theme)

A dark theme is the best choice to reduce bright light exposure. We will use a color scheme with sufficient contrast for readability, while remaining soft.

### Main Background (#1A1A1A)
An off-black. Provides a calm foundation without absorbing all light.

**Usage:** Main application background, area outside the frame.

### Panel Surface (#242424)
A dark gray. Used to distinguish panel areas (left and right) from the main background.

**Usage:** Asset Panel, Properties Panel.

### Interactive Accent (#3B82F6)
A bright but not neon blue. Stands out enough to signify clickable elements without being blinding.

**Usage:** Primary buttons, sliders, active icons, outline on selected objects.

### Primary Text (#E0E0E0)
An off-white. Provides comfortable reading contrast against the dark background, better than pure white (#FFFFFF) which can be too sharp.

### Secondary Text (#A0A0A0)
A light gray. For labels, placeholders, or less critical information.

## Typography

We need a highly legible font with clear letterforms.

### Primary Font (Body & UI): Inter

**Why?** "Inter" is a sans-serif font specifically designed for user interfaces on computer screens. It has a tall x-height, making it easy to read even at small sizes. This font is freely available on Google Fonts and is a standard in many modern design applications.

### Heading Font (Optional): Poppins (SemiBold)

**Why?** If you want a bit of variation, "Poppins" has clean, geometric shapes that work well for titles or panel headers. Using the SemiBold weight will provide enough emphasis without being overpowering.

## Components & Icons

Your choice to use shadcn/ui is excellent. It will significantly speed up development.

### Components
We will use built-in components from shadcn/ui such as Button, Slider, Toggle, and Dialog (for the "Share" pop-up). This ensures consistency and accessibility.

### Icons
We will use Lucide Icons, which are well-integrated into the shadcn/ui ecosystem. This provides a clean, consistent, and comprehensive set of icons for all our needs (e.g., icons for save, share, edit, eye, upload).