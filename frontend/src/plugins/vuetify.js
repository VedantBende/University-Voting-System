import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0891B2',      // Teal/Cyan
          secondary: '#64748B',
          background: '#F9FAFB',   // Light gray
          surface: '#FFFFFF',
          error: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
          info: '#0891B2',
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      variant: 'outlined',
    },
    VBtn: {
      style: 'text-transform: none;',
    },
  },
})

export default vuetify
