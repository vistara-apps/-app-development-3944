import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    subscriptionTier: 'free',
    generationCredits: 3
  })
  
  const [generatedMemes, setGeneratedMemes] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMeme = async (prompt, template, style) => {
    if (user.generationCredits <= 0 && user.subscriptionTier === 'free') {
      return { error: 'No credits remaining' }
    }

    setIsGenerating(true)
    
    // Simulate API call to OpenAI
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newMeme = {
      memeId: Date.now(),
      prompt,
      template,
      style,
      imageUrl: `https://picsum.photos/500/400?random=${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    setGeneratedMemes(prev => [newMeme, ...prev])
    
    if (user.subscriptionTier === 'free') {
      setUser(prev => ({
        ...prev,
        generationCredits: prev.generationCredits - 1
      }))
    }
    
    setIsGenerating(false)
    return { success: true, meme: newMeme }
  }

  const upgradeToProUser = () => {
    setUser(prev => ({
      ...prev,
      subscriptionTier: 'pro',
      generationCredits: Infinity
    }))
  }

  const buyCredits = (amount) => {
    setUser(prev => ({
      ...prev,
      generationCredits: prev.generationCredits + amount
    }))
  }

  return (
    <AppContext.Provider value={{
      user,
      generatedMemes,
      isGenerating,
      generateMeme,
      upgradeToProUser,
      buyCredits
    }}>
      {children}
    </AppContext.Provider>
  )
}