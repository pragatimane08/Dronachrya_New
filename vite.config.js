// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//   proxy: {
//     '/api': {
//       target: 'http://15.206.81.98:3000/api',
//       changeOrigin: true,
//       secure: false,
//       rewrite: (path) => path.replace(/^\/api/, ''),
//     },
//   },
// },

// });

/*Hosted API:- http://15.206.81.98:3000/api
LocalHost API:- http://192.168.1.9:3000/api */

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
  proxy: {
    '/api': {
      target: 'http://15.206.81.98:3000/api',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},

});