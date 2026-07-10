/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:        '#0c273c',
        rust:        '#a4552a', /* darkened from #bb6033 2026-07-07 for WCAG AA: white-on-rust 5.4:1, rust-on-cream 5.0:1 */
        cream:       '#faf5f1',
        bone:        '#e8e8e8',
        destructive: '#c72c12',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', '"Courier New"', 'monospace'],
      },
      // Flat design: radius 0 everywhere
      borderRadius: {
        none:    '0px',
        DEFAULT: '0px',
        sm:      '0px',
        md:      '0px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        '3xl':   '0px',
        full:    '9999px',
      },
      boxShadow: {
        // Flat: no shadows in the Navy v2 design
        none:    'none',
        DEFAULT: 'none',
        sm:      'none',
        md:      'none',
        lg:      'none',
        xl:      'none',
        '2xl':   'none',
        inner:   'none',
      },
      minHeight: {
        touch: '48p