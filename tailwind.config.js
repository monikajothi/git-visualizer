/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    { pattern: /^(bg|text|border)-(green|blue|purple|yellow|red|cyan|orange|muted)(\/\d+)?$/ },
    { pattern: /^(bg|text|border)-(green|blue|purple|yellow|red|cyan|orange)\/(5|10|20|30|40|50)$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg:       '#0d1117',
        surface:  '#161b22',
        surface2: '#1c2128',
        border:   '#30363d',
        txt:      '#e6edf3',
        muted:    '#7d8590',
        green:    '#3fb950',
        blue:     '#58a6ff',
        purple:   '#bc8cff',
        yellow:   '#e3b341',
        red:      '#f85149',
        cyan:     '#39d0d8',
        orange:   '#f78166',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      }
    }
  },
  plugins: []
}
