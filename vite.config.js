// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { config } from 'dotenv'

config();

// https://vite.dev/config/
export default defineConfig(({ mode } ) =>{
const env = loadEnv(mode, process.cwd(), '')

return {
      plugins: [react(), tailwindcss()],
      base: '/weatherapp-tailwind',
      define: {
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY)
      },
     
    }
  

 
})

