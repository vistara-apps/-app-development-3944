import React, { useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const MemeGeneratorForm = ({ selectedTemplate, selectedStyle, onStyleChange, onUpgradeNeeded }) => {
  const { user, generateMeme, isGenerating } = useApp()
  const [prompt, setPrompt] = useState('')

  const styles = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    { id: 'vintage', name: 'Vintage', description: 'Retro and nostalgic' },
    { id: 'bold', name: 'Bold', description: 'High contrast and impactful' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) return
    
    if (user.generationCredits <= 0 && user.subscriptionTier === 'free') {
      onUpgradeNeeded()
      return
    }

    const result = await generateMeme(prompt, selectedTemplate?.name || 'Default', selectedStyle)
    
    if (result.error) {
      onUpgradeNeeded()
    }
  }

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Wand2 className="w-5 h-5 text-purple-300" />
        <h2 className="text-lg font-semibold text-white">Generate Your Meme</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Describe your meme idea
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Distracted boyfriend but it's about choosing pizza toppings'"
            className="w-full h-20 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Style Selector */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            Choose Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => onStyleChange(style.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedStyle === style.id
                    ? 'bg-purple-500/30 border-2 border-purple-400'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
                disabled={isGenerating}
              >
                <div className="font-medium text-white text-sm">{style.name}</div>
                <div className="text-xs text-white/60">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full button-primary text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Meme</span>
            </>
          )}
        </button>

        {user.subscriptionTier === 'free' && (
          <p className="text-xs text-white/60 text-center">
            {user.generationCredits} free generations remaining
          </p>
        )}
      </form>
    </div>
  )
}

export default MemeGeneratorForm