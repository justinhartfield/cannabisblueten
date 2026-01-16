This document provides a comprehensive breakdown of the Design System reverse-engineered from the **CanNavi** web application.

---

# Design System Documentation: CanNavi

## 1. Core Principles
The CanNavi design system, titled **"Clinical Forest,"** is built to evoke trust, transparency, and medical professionalism. It balances the organic nature of cannabis with the precision of a pharmaceutical or healthcare platform.

*   **Medical Trust:** High-contrast typography and deep greens suggest authority and safety.
*   **Clarity & Cleanliness:** Generous use of whitespace and a "soft-white" background to reduce cognitive load.
*   **Modern Professionalism:** Utilization of the Manrope typeface provides a tech-forward, geometric feel that remains highly legible.
*   **Subtle Motion:** Use of slow pulses and floating animations to make the interface feel "alive" without being distracting.

---

## 2. Color Palette
The palette is centered around deep, desaturated greens and teals, moving away from "neon" cannabis tropes toward a clinical, healthcare-oriented aesthetic.

### Primary Brand Colors (Clinical)
| Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Clinical 900** | `#0f241f` | `text-clinical-900` | Deepest accents, heavy headings. |
| **Clinical 800** | `#1a3c34` | `bg-clinical-800` | Primary brand color, main text, buttons. |
| **Clinical 600** | `#3d5a54` | `text-clinical-600` | Secondary text, icons, sub-navigation. |
| **Clinical 200** | `#c7d5d2` | `border-clinical-200` | Borders, dividers, disabled states. |
| **Clinical 100** | `#e3eae8` | `bg-clinical-100` | Hover states, secondary containers. |
| **Clinical 50** | `#f4f7f6` | `bg-clinical-50` | Section backgrounds, card fills. |

### Functional & Accent Colors
| Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Safety Teal** | `#006d77` | `bg-safety` | Action items, health-related callouts. |
| **Soft Accent** | `#cfdbd5` | `bg-accent` | Subtle highlights, decorative elements. |
| **Body Background**| `#f8faf9` | `bg-[#f8faf9]` | Global page background. |

---

## 3. Typography
The system uses **Manrope**, a modern sans-serif with a wide range of weights, allowing for a clear information hierarchy.

*   **Font Family:** `Manrope`, sans-serif.
*   **Weights:** 200 (Extra Light), 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra Bold).
*   **Primary Text Color:** `clinical-800` (#1a3c34).
*   **Scale:**
    *   **H1/Hero:** 700-800 weight, tight tracking.
    *   **Body:** 400 weight, standard leading for readability.
    *   **Labels/Small:** 500-600 weight, often used in uppercase or for metadata.

---

## 4. Spacing & Layout
*   **Grid System:** Standard Tailwind CSS 12-column grid or Flexbox patterns.
*   **Container:** Max-width containers are used to keep content centered and readable on large displays.
*   **Spacing Scale:** Follows the standard Tailwind rem-based scale (e.g., `p-4`, `m-8`, `gap-6`).
*   **Smooth Scrolling:** Implemented globally via `scroll-smooth` for a premium feel during navigation.

---

## 5. Components (Patterns)

### Buttons
*   **Primary:** Solid `clinical-800` background with white text. Rounded corners (likely `rounded-lg` or `rounded-full`).
*   **Secondary:** Ghost or outlined styles using `clinical-600` or `safety` teal.

### Cards & Containers
*   **Style:** Minimalist with very subtle borders (`clinical-200`) or soft shadows.
*   **Backgrounds:** Often use `clinical-50` to separate content from the main `f8faf9` body background.

### Interactive Elements
*   **Alpine.js Integration:** Used for state management (modals, mobile menus, dropdowns) using `x-cloak` to prevent layout shift during load.

---

## 6. Iconography & Animation
*   **Icon Style:** Likely clean, line-based icons (e.g., Lucide or Heroicons) to match the geometric nature of the Manrope font.
*   **Animations:**
    *   `float`: A 3-second ease-in-out translation on the Y-axis for hero elements.
    *   `pulse-slow`: A 6-second subtle opacity/scale pulse for background decorative elements.

---

## Reference HTML

```html
<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CanNavi | Medical Cannabis Information & Comparison Germany</title>
    
    <!-- Fonts & Scripts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Manrope', 'sans-serif'] },
                    colors: {
                        clinical: {
                            50: '#f4f7f6',
                            100: '#e3eae8',
                            200: '#c7d5d2',
                            600: '#3d5a54',
                            800: '#1a3c34', // Deep medical forest
                            900: '#0f241f',
                        },
                        accent: '#cfdbd5',
                        safety: '#006d77',
                    },
                    animation: {
                        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'float': 'float 3s ease-in-out infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' },
                        }
                    }
                }
            }
        }
    </script>

    <style>
        [x-cloak] { display: none !important; }

        body {
            background-color: #f8faf9;
            color: #1a3c34;
            overflow-x: hidden;
        }

        /*
```