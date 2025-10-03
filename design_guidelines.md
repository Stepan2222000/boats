# Design Guidelines: Boat Marketplace

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Avito's efficient marketplace UX, Airbnb's visual appeal for high-value items, and automotive marketplaces like Auto.ru. The design balances utilitarian browsing efficiency with the premium nature of boat listings.

**Key Principles**:
- Clean, trustworthy marketplace aesthetics
- Photography-first for boats (premium visual products)
- Information density without clutter
- Mobile-first responsive design
- Russian language UI conventions

---

## Core Design Elements

### A. Color Palette

**Primary Colors** (Light Mode):
- Primary Blue: 205 85% 45% (brand color for CTAs, links, active states)
- Deep Blue: 210 90% 25% (headers, important text)
- White: 0 0% 100% (backgrounds, cards)
- Light Gray: 210 15% 96% (section backgrounds, borders)

**Accent & Semantic**:
- Success Green: 145 65% 45% (available status, positive actions)
- Warning Orange: 30 95% 55% (moderation, warnings)
- Error Red: 355 75% 50% (sold, errors)
- Neutral Gray: 210 10% 50% (secondary text, disabled states)

**Dark Mode** (if needed later):
- Background: 215 25% 12%
- Cards: 215 20% 18%
- Text: 210 15% 90%

### B. Typography

**Font Families**:
- Primary: 'Inter', system-ui, sans-serif (excellent Cyrillic support, clean readability)
- Headings: 'Inter', weight 600-700
- Body: 'Inter', weight 400-500

**Type Scale**:
- Hero/Display: text-4xl (36px) to text-5xl (48px), font-semibold
- H1: text-3xl (30px), font-semibold
- H2: text-2xl (24px), font-semibold
- H3: text-xl (20px), font-medium
- Body Large: text-lg (18px), font-normal
- Body: text-base (16px), font-normal
- Small: text-sm (14px), font-normal
- Caption: text-xs (12px), font-normal

**Russian Language Considerations**:
- Slightly increased line-height (1.6) for better Cyrillic readability
- Avoid all-caps for Russian text (poor readability)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Compact spacing: p-2, p-4 (mobile, dense lists)
- Standard spacing: p-6, p-8 (cards, sections)
- Generous spacing: p-12, p-16, p-20 (page sections, hero areas)

**Container Widths**:
- Full-width sections: max-w-7xl (1280px)
- Content sections: max-w-6xl (1152px)
- Reading content: max-w-4xl (896px)

**Grid Patterns**:
- Listing cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Filters sidebar: Fixed 280px width on desktop, full-width drawer on mobile

### D. Component Library

**Navigation**:
- Header: Sticky top bar, white background, shadow on scroll
- Logo placement: Left, blue accent
- Search bar: Prominent center position on desktop, expandable on mobile
- User menu: Right side with avatar/icon

**Listing Cards** (Critical Component):
- Aspect ratio: 4:3 for primary photo
- Card structure: Photo → Price (large, bold) → Title (2 lines max) → Key specs (3-4 icons with values) → Location + Date
- Hover state: Subtle lift (shadow-lg), scale-102 transform
- Status badges: Absolute positioned top-right (Новое, Промо, Продано)

**Filters Panel**:
- Collapsible sections with chevron icons
- Checkboxes for multi-select, radio for single-select
- Range sliders for price, year, length
- "Применить фильтры" sticky button at bottom
- Clear filters link

**CTAs & Buttons**:
- Primary: bg-blue (brand), white text, rounded-lg, py-3 px-6
- Secondary: border-2 border-blue, blue text, rounded-lg
- Ghost/Text: No background, blue text, underline on hover
- Icon buttons: Favorites (heart), share icons - rounded-full, hover:bg-gray-100

**Detail Page Components**:
- Photo gallery: Large main image with thumbnail strip below, lightbox on click
- Price card: Sticky on scroll (mobile), prominent display with "Показать телефон" and "Написать" CTAs
- Specs table: 2-column layout, alternating row backgrounds, icons for categories
- Seller card: Avatar, name, rating stars, response rate, "Все объявления" link
- Location map: Embedded, rounded corners, 400px height

**Messaging Interface**:
- Chat list: Avatar, name, last message preview, unread badge
- Chat window: Fixed header with seller info, scrollable message area, input at bottom
- Message bubbles: Buyer (blue, right), Seller (gray, left), rounded-lg, max-width-prose

**Forms**:
- Input fields: border-2, rounded-lg, p-3, focus:ring-2 focus:ring-blue
- Labels: text-sm, font-medium, mb-2
- Validation: Inline errors in red, success checkmarks in green
- File upload: Drag-drop zone with preview thumbnails

### E. Animations

Use sparingly:
- Page transitions: Fade-in (duration-200)
- Card hovers: Scale and shadow (duration-150)
- Filter panel: Slide-in from left (duration-300)
- Loading states: Skeleton screens (pulse animation)
- NO parallax, NO complex scroll-driven animations

---

## Images & Photography

**Hero Section**:
- Large hero image: Premium boat photo (sailing yacht or speedboat), aspect ratio 21:9, overlay with gradient (from transparent to rgba(0,0,0,0.4))
- Hero text over image: White text with text-shadow for readability
- Search bar: Centered, white card with shadow, floating over hero image

**Listing Photography Guidelines**:
- Primary image: Always show boat in best angle, water setting preferred
- Minimum 3 photos per listing (exterior, interior, engine/details)
- Aspect ratio: 4:3 for consistency in grids
- Quality: High resolution, well-lit, no watermarks (except subtle seller branding)

**Trust Badges & Icons**:
- Seller badges: SVG icons, 24px, positioned near seller name
- Specification icons: Line-style icons from Heroicons (anchor, ruler, users, engine, etc.)
- Status indicators: Color-coded dots (green=available, orange=pending, red=sold)

**Placeholder States**:
- No photo: Use blue gradient with boat icon silhouette
- Loading images: Skeleton with pulse animation
- Empty states: Illustration + helpful text (e.g., "Сохранённых поисков пока нет")

---

## Page-Specific Layouts

**Homepage**:
- Hero: Full-width photo with overlay, large search input, quick category buttons below
- "Часто ищут": 3-column grid of popular search chips
- Featured listings: 4-column grid, "Промо" badge on promoted items
- Trust section: 2-column layout with statistics (number of listings, users, etc.)

**Catalog/Search Results**:
- Filters sidebar: Left, sticky, collapsible on mobile
- Results area: Breadcrumbs → View toggle (grid/list) + Sort dropdown → Counter → Listing grid
- Grid: Responsive, 4 columns desktop → 2 tablet → 1 mobile
- "Сохранить поиск" button: Prominent, top-right of results area

**Listing Detail**:
- Gallery: Left 60%, specs/price card right 40% (desktop), stacked on mobile
- CTAs: Sticky bottom bar on mobile with "Телефон" and "Написать"
- Transparency badges: Small pills indicating "указал продавец" vs "добавлено автоматически"
- Related listings: 4-column grid at bottom

**Seller Profile**:
- Cover photo: Optional banner image (boats/marina)
- Profile header: Avatar, name, badges, stats (active listings, rating, join date)
- Tabs: Активные / Архивные / Отзывы
- Listing grid: Same as catalog

**Admin Panel**:
- Sidebar navigation: Dark background (gray-900), white/blue text
- Content area: White cards with rounded-lg, shadow
- Tables: Striped rows, sortable columns, action buttons right-aligned
- Metrics: Dashboard cards with large numbers, trend indicators (arrows)

---

## Mobile Responsiveness

- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile-first approach: Stack all multi-column layouts on mobile
- Touch targets: Minimum 44px for all interactive elements
- Bottom navigation: Fixed bottom bar for primary actions on listing pages
- Hamburger menu: For main navigation on mobile
- Swipeable galleries: Touch-optimized photo browsing

---

## Accessibility & Trust Elements

- ARIA labels for all interactive elements (Russian language)
- Focus states: 2px blue ring on all focusable elements
- Contrast ratio: WCAG AA minimum (4.5:1 for text)
- Seller verification indicators: Clear visual hierarchy for badges
- Review stars: 5-star rating with half-star precision
- Timestamp formats: Relative ("2 часа назад") for recent, absolute for older