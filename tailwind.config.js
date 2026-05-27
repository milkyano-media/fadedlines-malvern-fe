/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    darkMode: ["class"],
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            boxShadow: {
                tiny: "0px 0px 70px 2px",
                "super-large": "0px 4px 39px 31px",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                lime: "#33FF00",
                // Parameter-based theme colors
                "theme-primary": "var(--primary-color)",
                "theme-secondary": "var(--secondary-color)",
                "theme-bg": "var(--background-color)",
                "theme-card": "#0a0a0a",
                "theme-border": "var(--border-color)",
                "theme-text": "var(--text-color-primary)",
                "theme-text-muted": "var(--text-color-secondary)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                scaleIn: {
                    "0%": { transform: "scale(0)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                slideDown: {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(10px)" },
                },
                scaleDown: {
                    "0%": { transform: "scale(1)" },
                    "100%": { transform: "scale(0.2)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(10px)" },
                    "100%": { transform: "translateY(0)" },
                },
                scaleUp: {
                    "0%": { transform: "scale(0.2)" },
                    "100%": { transform: "scale(1)" },
                },
                fadeOut: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                scaleIn: "scaleIn 0.3s ease-in-out forwards",
                "accordion-down":
                    "accordion-down 0.2s ease-out, fadeIn 0.5s ease-out, scaleUp 0.5s ease-out, slideUp 0.5s ease-out",
                "accordion-up":
                    "accordion-up 0.2s ease-out, fadeOut 0.5s ease-out, scaleDown 0.5s ease-out, slideDown 0.5s ease-out",
            },
        },
    },
    // eslint-disable-next-line no-undef
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
