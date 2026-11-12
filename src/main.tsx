import { setupIonicReact } from '@ionic/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/palettes/dark.always.css'
import '@fontsource/heebo/hebrew-400.css'
import '@fontsource/heebo/latin-400.css'
import '@fontsource/heebo/hebrew-500.css'
import '@fontsource/heebo/latin-500.css'
import '@fontsource/heebo/hebrew-600.css'
import '@fontsource/heebo/latin-600.css'
import '@fontsource/frank-ruhl-libre/hebrew-300.css'
import '@fontsource/frank-ruhl-libre/latin-300.css'
import '@fontsource/frank-ruhl-libre/hebrew-400.css'
import '@fontsource/frank-ruhl-libre/latin-400.css'
import './ionic-palette.css'
import './theme.css'
import './globals.css'
import './app-header.css'

import { App } from './App'

setupIonicReact({ mode: 'ios' })

navigator.storage?.persist?.()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
