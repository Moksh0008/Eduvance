import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppStateProvider } from './context/AppState.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { FontSizeProvider } from './context/FontSizeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppStateProvider>
          <FontSizeProvider>
            <App />
          </FontSizeProvider>
        </AppStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
