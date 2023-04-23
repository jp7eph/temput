import { createApp } from 'vue'
import './style.css'
import Options from './Options.vue'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { mdiPlus, mdiPencil, mdiDelete, mdiUndo, mdiRedo, mdiFormatBold, mdiFormatItalic, mdiFormatStrikethrough, mdiFormatListBulleted, mdiFormatListNumbered, mdiCodeTags } from '@mdi/js'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases: {
            ...aliases,
            plus: mdiPlus,
            pencil: mdiPencil,
            delete: mdiDelete,
            undo: mdiUndo,
            redo: mdiRedo,
            bold: mdiFormatBold,
            italic: mdiFormatItalic,
            strike: mdiFormatStrikethrough,
            listBulleted: mdiFormatListBulleted,
            listNumbered: mdiFormatListNumbered,
            code: mdiCodeTags,
        },
        sets: {
            mdi,
        }
    }
})

createApp(Options).use(vuetify).mount('#options')