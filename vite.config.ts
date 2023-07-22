import { defineConfig, version } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx, defineManifest } from '@crxjs/vite-plugin'
// import manifest from './manifest.json' // Node 14 & 16
// import manifest from './manifest.json' assert { type: 'json' } // Node >=17

const manifest = defineManifest({
  manifest_version: 3,
  name: 'temput',
  description: 'Enter template text',
  version: '0.0.1',
  icons: {
    '16': 'icons/temput_16.png',
    '32': 'icons/temput_32.png',
    '48': 'icons/temput_48.png',
    '128': 'icons/temput_128.png',
  },
  permissions: [
    'storage'
  ],
  action: {
    'default_popup': 'index.html'
  },
  options_ui: {
    'page': 'options.html'
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
})
