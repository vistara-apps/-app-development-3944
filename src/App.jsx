import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppShell from './components/AppShell'
import MemeGenerator from './components/MemeGenerator'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="gradient-bg">
        <AppShell>
          <MemeGenerator />
        </AppShell>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: '#333',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AppProvider>
  )
}

export default App
