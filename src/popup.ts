import { createApp } from 'vue'
import './style.css'
import Popup from './Popup.vue'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { mdiCog, mdiContentPaste } from '@mdi/js'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases: {
            ...aliases,
            cog: mdiCog,
            paste: mdiContentPaste,
        },
        sets: {
            mdi,
        }
    }
})

createApp(Popup).use(vuetify).mount('#popup')
