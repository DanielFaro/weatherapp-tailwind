/** @type {import('tailwindcss').Config} */
import { mauve, violet } from '@radix-ui/colors'
import { transform } from 'motion'
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  // variants: {
    
  //   extend: {
  //     // darkMode: {
    
  //       colors: {
  //         ...mauve,
  //         ...violet
  //       },
  //       keyframes: {
  //         slideDown: {
  //           from: { height: "0px" },
  //           to: { height: "50px" }
  //         },
  //         slideUp: {
  //           from: { height: "50px" },
  //           to: { height: "0px" }
  //         }
  //       },
  //       animation: {
  //         slideDown: "slideDown 800ms cubic-bezier(0.87, 0, 0.13, 1)",
  //         slideUp: "slideUp 800ms cubic-bezier(0.87, 0, 0.13, 1)"
  //       }
  //     },
   
    
  // },
  theme: {
    fontFamily: {
      body: ['Quicksand', 'sans-serif']
    },
    extend: {
      colors: {
        primary: "var(--color-primary)",
        bkg: "hsl(210, 40%, 98%)"
      },
      keyframes: {
        flip: {
          transform: 'rotate(180deg)'
        }
      },
      animation: {
        flip: "flip 500ms"
      },
      height: {
        screen: '100dvh'
      },
      width: {
        screen: '100dvw'
      },
      
   
    },
  
  },
  
  plugins: [],
}

