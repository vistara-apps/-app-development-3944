import React from 'react'
import { Download, Share2, Heart, Copy } from 'lucide-react'
import ShareButtons from './ShareButtons'

const MemeDisplay = ({ meme, isGenerating }) => {
  if (isGenerating) {
    return (
      <div className="glass-effect rounded-lg p-6">
        <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-white/80">Generating your meme...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!meme) {
    return (
      <div className="glass-effect rounded-lg p-6">
        <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center border-2 border-dashed border-white/30">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <Share2 className="w-8 h-8 text-white/60" />
            </div>
            <p className="text-white/60">Your generated meme will appear here</p>
          </div>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = meme.imageUrl
    link.download = `meme-${meme.memeId}.jpg`
    link.click()
  }

  return (
    <div className="glass-effect rounded-lg p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Generated Image */}
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src={meme.imageUrl}
            alt={meme.prompt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meme Info */}
        <div className="space-y-3">
          <p className="text-white/80 text-sm">{meme.prompt}</p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Download</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Like</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
              <Copy className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Copy Link</span>
            </button>
          </div>

          {/* Share Buttons */}
          <ShareButtons meme={meme} />
        </div>
      </div>
    </div>
  )
}

export default MemeDisplay