import React, { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, MessageCircle, Copy, Download } from 'lucide-react'
import { 
  shareToTwitter, 
  shareToFacebook, 
  shareToLinkedIn, 
  shareToWhatsApp,
  shareToReddit,
  copyToClipboard, 
  downloadMeme,
  shareViaWebShare,
  trackShare,
  isPlatformAvailable
} from '../services/social'
import toast from 'react-hot-toast'

const ShareButtons = ({ meme, variant = 'social' }) => {
  const [copied, setCopied] = useState(false)

  const handleShare = async (platform, shareFunction) => {
    try {
      await shareFunction(meme)
      await trackShare(meme.memeId, platform)
      toast.success(`Shared to ${platform}!`)
    } catch (error) {
      console.error(`Failed to share to ${platform}:`, error)
      toast.error(`Failed to share to ${platform}`)
    }
  }

  const handleCopy = async () => {
    try {
      const result = await copyToClipboard(meme)
      if (result.success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success(result.type === 'image' ? 'Image copied to clipboard!' : 'Link copied to clipboard!')
        await trackShare(meme.memeId, 'clipboard')
      }
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy')
    }
  }

  const handleDownload = async () => {
    try {
      const result = await downloadMeme(meme)
      if (result.success) {
        toast.success('Meme downloaded!')
        await trackShare(meme.memeId, 'download')
      }
    } catch (error) {
      console.error('Failed to download:', error)
      toast.error('Failed to download meme')
    }
  }

  const handleWebShare = async () => {
    try {
      const result = await shareViaWebShare(meme)
      if (result.success) {
        await trackShare(meme.memeId, 'webshare')
      }
    } catch (error) {
      // Fallback to copy link
      handleCopy()
    }
  }

  if (variant === 'copyLink') {
    return (
      <button
        onClick={handleCopy}
        className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-white/60 text-sm">Share your meme:</p>
      <div className="flex flex-wrap gap-2">
        {/* Native Web Share API (mobile) */}
        {isPlatformAvailable('webshare') && (
          <button
            onClick={handleWebShare}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1"
          >
            <Share2 size={14} />
            Share
          </button>
        )}
        
        {/* Twitter */}
        <button
          onClick={() => handleShare('Twitter', shareToTwitter)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1"
        >
          <Twitter size={14} />
          Twitter
        </button>
        
        {/* Facebook */}
        <button
          onClick={() => handleShare('Facebook', shareToFacebook)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1"
        >
          <Facebook size={14} />
          Facebook
        </button>
        
        {/* Reddit */}
        <button
          onClick={() => handleShare('Reddit', shareToReddit)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          Reddit
        </button>
        
        {/* WhatsApp */}
        <button
          onClick={() => handleShare('WhatsApp', shareToWhatsApp)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
        
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1"
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        {/* Download */}
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1"
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  )
}

export default ShareButtons
