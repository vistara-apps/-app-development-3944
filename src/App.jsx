import React, { useState } from 'react'
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
      </div>
    </AppProvider>
  )
}

export default App