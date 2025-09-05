import React from 'react'

const ShareButtons = ({ meme, variant = 'social' }) => {
  const shareToTwitter = () => {
    const text = `Check out this meme I created with MemeFlow AI! "${meme.prompt}"`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(meme.imageUrl)}`
    window.open(url, '_blank')
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(meme.imageUrl)}`
    window.open(url, '_blank')
  }

  const shareToReddit = () => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(meme.imageUrl)}&title=${encodeURIComponent(meme.prompt)}`
    window.open(url, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(meme.imageUrl)
    // Could add toast notification here
  }

  if (variant === 'copyLink') {
    return (
      <button
        onClick={copyLink}
        className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
      >
        Copy Link
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-white/60 text-sm">Share your meme:</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareToTwitter}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          Twitter
        </button>
        <button
          onClick={shareToFacebook}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          Facebook
        </button>
        <button
          onClick={shareToReddit}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          Reddit
        </button>
        <button
          onClick={copyLink}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          Copy Link
        </button>
      </div>
    </div>
  )
}

export default ShareButtons