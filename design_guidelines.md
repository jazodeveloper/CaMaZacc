# CaMaZac Real Estate Website - Design Guidelines

## Design Approach
**Custom Brand-Driven Design** - Following the specific aesthetic and functional requirements for the CaMaZac real estate platform with established color palette and typography.

## Core Brand Identity

**Color Palette:**
- Primary Yellow: #FFD700 (Gold)
- Secondary Yellow: #F2C200 
- Neutral Dark: Dark gray (#2D2D2D) or black (#000000)
- White: #FFFFFF for backgrounds and text
- Accent: Subtle gray (#F5F5F5) for card backgrounds

**Typography:**
- Primary Font: Poppins (Google Fonts)
- Alternative: Montserrat (Google Fonts)
- Headings: Poppins Bold/Semibold
- Body Text: Poppins Regular (400)
- Accents: Poppins Medium (500)

## Layout System

**Spacing Scale:**
- Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-16 to py-24
- Card padding: p-6 to p-8
- Element gaps: gap-4, gap-6, gap-8

**Container Widths:**
- Max content width: max-w-7xl
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

**Navigation Bar (Fixed):**
- Fixed to top with backdrop blur
- Logo "CaMaZac" positioned top-left
- Navigation links aligned right
- Height: h-20
- Background: Semi-transparent dark with yellow accent on active items
- Sticky positioning with subtle shadow on scroll

**Property Cards:**
- Card-based layout with rounded corners (rounded-lg)
- Image aspect ratio: 4:3 or 16:9
- Hover effect: Subtle lift (transform) with shadow increase
- Content: Property image, title, address, price (prominent), type badge
- Price displayed in large, bold yellow text
- Smooth transition on all hover effects (transition-all duration-300)

**Buttons:**
- Primary: Yellow background (#FFD700) with dark text
- Secondary: Dark background with yellow border
- CTA buttons: Large padding (px-8 py-4), rounded corners
- Hover: Slight color shift and subtle scale
- On images: Blurred background (backdrop-blur-md) with semi-transparent dark overlay

**Forms:**
- Input fields with dark borders, yellow focus ring
- Rounded inputs (rounded-md)
- Generous padding (px-4 py-3)
- Clear labels above fields
- Error states in red with yellow accent

**Footer:**
- Dark background with yellow accents
- Multi-column layout: Company info, Quick links, Contact, Social media
- Social media icons in yellow
- Copyright centered at bottom

## Page-Specific Layouts

**Homepage (index.html):**
- Hero section with large property showcase image
- Overlay with semi-transparent dark background
- Main heading + CTA button with blurred background
- Featured properties section (3-column grid)
- Services/Why Choose Us section
- Call-to-action section before footer

**Properties Catalog (propiedades.html):**
- Filter sidebar or top bar (Type, Price range, Location)
- Property grid (3 columns desktop, 2 tablet, 1 mobile)
- Each card shows: Image, title, address, price, type badge, view details button
- Pagination at bottom

**Login/Register Pages:**
- Centered form container (max-w-md)
- Clean white card with subtle shadow on dark background
- Yellow accent for active inputs and submit button
- Link to alternate action (register/login)

**Admin Panel (admin.html):**
- Dashboard layout with sidebar navigation
- Property management table or grid
- Add/Edit property forms with image upload areas (up to 5 images)
- Messages inbox section
- Statistics cards at top (total properties, messages, users)

**Contact Page:**
- Two-column layout (form + contact information)
- Form on left, info/map placeholder on right
- Yellow accent for form elements

## Images

**Hero Image:**
- Large, high-quality property/cityscape image
- Full viewport width
- Height: 60-80vh
- Dark overlay (opacity-50) for text contrast
- Positioned: Top of homepage

**Property Images:**
- Professional real estate photography
- Consistent aspect ratios across all cards
- High resolution, optimized for web
- Multiple images per property (up to 5)
- Placeholder images if none uploaded

**Background Patterns:**
- Subtle geometric patterns in dark sections
- Optional: Diagonal split backgrounds (yellow/dark)

## Interactions & Animations

**Minimized Animations:**
- Card hover: translateY(-4px) with shadow increase
- Button hover: Subtle color shift
- Page transitions: Fade in content
- Form validation: Shake effect on error
- Image galleries: Simple fade transitions

**No Distracting Elements:**
- Avoid auto-playing carousels
- Minimal parallax effects
- No excessive floating animations

## Accessibility

- High contrast between yellow and dark backgrounds
- Sufficient font sizes (min 16px body text)
- Clear focus states on interactive elements
- Semantic HTML structure
- Alt text for all property images
- Form labels properly associated

## Key Visual Principles

- **Professional Elegance:** Clean, sophisticated layout avoiding clutter
- **Yellow as Accent:** Strategic use of yellow for CTAs, highlights, and branding elements
- **Card-Based Design:** Consistent card treatment across property listings
- **Dark Foundation:** Dark backgrounds create luxury feel with yellow pops
- **Clear Hierarchy:** Price and property titles as focal points
- **Ample Whitespace:** Breathing room around elements for premium feel