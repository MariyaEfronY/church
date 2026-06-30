// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Fixes standard prose layout blocks
        sans: ["var(--font-inter)", "var(--font-noto-tamil)", "sans-serif"],
        // Fixes premium headings and titles
        serif: ["ui-serif", "Georgia", "var(--font-noto-tamil)", "serif"],
      },
    },
  },
};
