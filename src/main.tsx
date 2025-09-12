import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize MSW for mock API in both dev and production
async function enableMocking() {
  // Enable MSW in development AND production for demo purposes
  // Only disable in test environment
  if (import.meta.env.MODE === 'test') {
    return
  }

  try {
    const { worker } = await import('./data/api/browser')

    // Configure service worker with appropriate options
    const workerOptions = {
      // Use quiet mode in production to reduce console noise
      quiet: import.meta.env.PROD,
      // Handle service worker registration errors gracefully
      onUnhandledRequest: 'bypass' as const,
    }

    // Start the service worker and handle any errors
    await worker.start(workerOptions)
    
    if (!import.meta.env.PROD) {
      console.log('🔧 MSW enabled for API mocking')
    }
  } catch (error) {
    console.error('Failed to start MSW:', error)
    // Continue app initialization even if MSW fails
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
