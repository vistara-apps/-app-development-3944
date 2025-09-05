import React, { createContext, useContext } from 'react'
import useMemeFlowStore from '../store'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const store = useMemeFlowStore()

  // Create a compatibility layer for existing components
  const contextValue = {
    user: store.user,
    generatedMemes: store.memes,
    isGenerating: store.isGenerating,
    generateMeme: store.generateMeme,
    upgradeToProUser: store.upgradeUser,
    buyCredits: store.purchaseCredits,
    // Additional new features
    templates: store.templates,
    selectedTemplate: store.selectedTemplate,
    selectTemplate: store.selectTemplate,
    showUpgradeModal: store.showUpgradeModal,
    showUpgrade: store.showUpgrade,
    hideUpgrade: store.hideUpgrade
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
