import React, { useState } from 'react'
import MemeGeneratorForm from './MemeGeneratorForm'
import TemplateSelector from './TemplateSelector'
import MemeDisplay from './MemeDisplay'
import UpgradePrompt from './UpgradePrompt'
import { useApp } from '../context/AppContext'

const MemeGenerator = () => {
  const { user, generatedMemes, isGenerating } = useApp()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [showUpgrade, setShowUpgrade] = useState(false)

  const latestMeme = generatedMemes[0]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          MemeFlow AI
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
          Turn your wildest meme ideas into reality with AI templates
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Generation Tools */}
        <div className="space-y-6">
          {/* Template Selector */}
          <TemplateSelector 
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
          />

          {/* Meme Generator Form */}
          <MemeGeneratorForm 
            selectedTemplate={selectedTemplate}
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            onUpgradeNeeded={() => setShowUpgrade(true)}
          />
        </div>

        {/* Right Column - Output */}
        <div className="space-y-6">
          {/* Generated Meme Display */}
          <MemeDisplay 
            meme={latestMeme}
            isGenerating={isGenerating}
          />

          {/* Recent Memes */}
          {generatedMemes.length > 1 && (
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Creations</h3>
              <div className="grid grid-cols-2 gap-3">
                {generatedMemes.slice(1, 5).map((meme) => (
                  <div key={meme.memeId} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={meme.imageUrl} 
                      alt={meme.prompt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      {showUpgrade && (
        <UpgradePrompt onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}

export default MemeGenerator