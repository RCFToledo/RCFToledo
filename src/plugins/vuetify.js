// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colors from 'vuetify/lib/util/colors'

// Vuetify
import { createVuetify } from 'vuetify'
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#01579B", // #37474F
          secondary: colors.grey.lighten2, // #455a64     
          fesuccess: '#628b48',  
          fewarning: '#FFC43D',  
          feerror: '#d74d45',  
        }
      },
    },
  },
})