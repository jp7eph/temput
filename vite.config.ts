import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import PackageJson from './package.json'
// import manifest from './manifest.json' // Node 14 & 16
// import manifest from './manifest.json' assert { type: 'json' } // Node >=17

const manifest = defineManifest({
  manifest_version: 3,
  name: 'temput',
  description: 'Copy template text',
  version: PackageJson.version,
  icons: {
    16: 'icons/temput_16.png',
    32: 'icons/temput_32.png',
    48: 'icons/temput_48.png',
    128: 'icons/temput_128.png',
  },
  permissions: [
    'storage'
  ],
  action: {
    default_popup: 'index.html'
  },
  options_ui: {
    page: 'options.html',
    open_in_tab: true
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
})
