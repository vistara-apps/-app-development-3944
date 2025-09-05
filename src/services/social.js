// Social Media Sharing Service

export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  REDDIT: 'reddit',
  TELEGRAM: 'telegram',
  WHATSAPP: 'whatsapp'
}

export const shareToTwitter = (meme, text = '') => {
  const shareText = text || `Check out this AI-generated meme I created with MemeFlow AI! 🤖✨\n\n"${meme.prompt}"`
  const url = `${window.location.origin}/meme/${meme.memeId}`
  const hashtags = 'MemeFlowAI,AIMemes,MemeMaker'
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`
  
  window.open(twitterUrl, '_blank', 'width=550,height=420')
}

export const shareToFacebook = (meme) => {
  const url = `${window.location.origin}/meme/${meme.memeId}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  
  window.open(facebookUrl, '_blank', 'width=580,height=296')
}

export const shareToLinkedIn = (meme, text = '') => {
  const shareText = text || `Just created this amazing meme with AI! Check out MemeFlow AI for instant meme generation.`
  const url = `${window.location.origin}/meme/${meme.memeId}`
  
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(shareText)}`
  
  window.open(linkedInUrl, '_blank', 'width=520,height=570')
}

export const shareToReddit = (meme, subreddit = 'memes') => {
  const title = `AI-generated meme: "${meme.prompt}"`
  const url = `${window.location.origin}/meme/${meme.memeId}`
  
  const redditUrl = `https://www.reddit.com/r/${subreddit}/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  
  window.open(redditUrl, '_blank')
}

export const shareToTelegram = (meme, text = '') => {
  const shareText = text || `Check out this AI meme I made! 🤖\n"${meme.prompt}"\n\nMade with MemeFlow AI`
  const url = `${window.location.origin}/meme/${meme.memeId}`
  
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`
  
  window.open(telegramUrl, '_blank')
}

export const shareToWhatsApp = (meme, text = '') => {
  const shareText = text || `Check out this AI meme I created! 🤖\n\n"${meme.prompt}"\n\n${window.location.origin}/meme/${meme.memeId}\n\nMade with MemeFlow AI ✨`
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  
  window.open(whatsappUrl, '_blank')
}

export const copyToClipboard = async (meme, includeImage = false) => {
  try {
    if (includeImage && navigator.clipboard && window.ClipboardItem) {
      // Try to copy image to clipboard (modern browsers)
      const response = await fetch(meme.imageUrl)
      const blob = await response.blob()
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      return { success: true, type: 'image' }
    } else {
      // Fallback to copying URL
      const url = `${window.location.origin}/meme/${meme.memeId}`
      await navigator.clipboard.writeText(url)
      
      return { success: true, type: 'url' }
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    
    // Final fallback - create temporary input
    const tempInput = document.createElement('input')
    tempInput.value = `${window.location.origin}/meme/${meme.memeId}`
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)
    
    return { success: true, type: 'url' }
  }
}

export const downloadMeme = async (meme, filename = null) => {
  try {
    const response = await fetch(meme.imageUrl)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `memeflow-${meme.memeId}.png`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  } catch (error) {
    console.error('Error downloading meme:', error)
    return { success: false, error: error.message }
  }
}

export const shareViaWebShare = async (meme) => {
  if (!navigator.share) {
    throw new Error('Web Share API not supported')
  }

  try {
    // Try to share with image
    const response = await fetch(meme.imageUrl)
    const blob = await response.blob()
    const file = new File([blob], `meme-${meme.memeId}.png`, { type: blob.type })

    await navigator.share({
      title: 'Check out this AI meme!',
      text: `"${meme.prompt}" - Made with MemeFlow AI`,
      url: `${window.location.origin}/meme/${meme.memeId}`,
      files: [file]
    })

    return { success: true }
  } catch (error) {
    // Fallback to sharing without image
    try {
      await navigator.share({
        title: 'Check out this AI meme!',
        text: `"${meme.prompt}" - Made with MemeFlow AI`,
        url: `${window.location.origin}/meme/${meme.memeId}`
      })

      return { success: true }
    } catch (fallbackError) {
      console.error('Web share error:', fallbackError)
      return { success: false, error: fallbackError.message }
    }
  }
}

export const getShareableUrl = (meme) => {
  return `${window.location.origin}/meme/${meme.memeId}`
}

export const generateShareText = (meme, platform = 'generic') => {
  const baseText = `Check out this AI-generated meme I created!`
  const prompt = `"${meme.prompt}"`
  const url = getShareableUrl(meme)
  const appName = 'MemeFlow AI'

  switch (platform) {
    case SOCIAL_PLATFORMS.TWITTER:
      return `${baseText} 🤖✨\n\n${prompt}\n\n#MemeFlowAI #AIMemes #MemeMaker`
    
    case SOCIAL_PLATFORMS.FACEBOOK:
      return `${baseText}\n\n${prompt}\n\nMade with ${appName} - the easiest way to create viral memes with AI!`
    
    case SOCIAL_PLATFORMS.LINKEDIN:
      return `Just discovered ${appName} and created this amazing meme with AI! The future of content creation is here. ${prompt}`
    
    case SOCIAL_PLATFORMS.REDDIT:
      return `AI-generated meme: ${prompt}`
    
    case SOCIAL_PLATFORMS.TELEGRAM:
    case SOCIAL_PLATFORMS.WHATSAPP:
      return `${baseText} 🤖\n\n${prompt}\n\n${url}\n\nMade with ${appName} ✨`
    
    default:
      return `${baseText}\n\n${prompt}\n\n${url}\n\nMade with ${appName}`
  }
}

// Analytics tracking for shares
export const trackShare = async (memeId, platform) => {
  try {
    // In a real app, this would send analytics data to your backend
    console.log('Share tracked:', { memeId, platform, timestamp: new Date().toISOString() })
    
    // You could integrate with analytics services like Google Analytics, Mixpanel, etc.
    if (window.gtag) {
      window.gtag('event', 'share', {
        event_category: 'meme',
        event_label: platform,
        custom_parameter_1: memeId
      })
    }
  } catch (error) {
    console.error('Error tracking share:', error)
  }
}

// Utility function to check if a platform is available
export const isPlatformAvailable = (platform) => {
  switch (platform) {
    case 'webshare':
      return !!navigator.share
    case 'clipboard':
      return !!navigator.clipboard
    default:
      return true // Most platforms are always available (they open in new windows)
  }
}
