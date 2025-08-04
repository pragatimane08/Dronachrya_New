/** @type {import ('tailwindcss').Config} */
export default{
    content:[
      
         "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme:{
       extend :  {
          colors: {
    'custom-teal': '#35BAA3',
  },
    screens: {
      'fold': {'raw': '(max-width: 899px) and (min-height: 600px) and (orientation: landscape)'},
    }
       },
    },
    plugins:[],
}