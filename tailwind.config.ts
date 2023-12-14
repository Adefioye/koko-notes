import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Nunito Sans",
          "Nunito Sans Fallback",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [
    require( 'tailwindcss' ),
    require( 'postcss' ),
    require( 'autoprefixer' ),
  ],
};
export default config;
