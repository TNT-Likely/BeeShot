import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@beeshot/ui/src/styles/index.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
