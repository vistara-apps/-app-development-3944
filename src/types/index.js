// Type definitions for MemeFlow AI

// User Types
export const USER_SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro'
}

export const createUser = (data = {}) => ({
  userId: data.userId || null,
  email: data.email || '',
  subscriptionTier: data.subscriptionTier || USER_SUBSCRIPTION_TIERS.FREE,
  generationCredits: data.generationCredits || 3,
  createdAt: data.createdAt || new Date().toISOString(),
  ...data
})

// Meme Types
export const MEME_STYLES = {
  MODERN: 'modern',
  VINTAGE: 'vintage',
  MINIMALIST: 'minimalist',
  BOLD: 'bold',
  ARTISTIC: 'artistic',
  CARTOON: 'cartoon',
  REALISTIC: 'realistic'
}

export const createMeme = (data = {}) => ({
  memeId: data.memeId || Date.now(),
  userId: data.userId || null,
  prompt: data.prompt || '',
  imageUrl: data.imageUrl || '',
  template: data.template || null,
  style: data.style || MEME_STYLES.MODERN,
  ipfsHash: data.ipfsHash || null,
  ipfsUrl: data.ipfsUrl || null,
  createdAt: data.createdAt || new Date().toISOString(),
  ...data
})

// Template Types
export const TEMPLATE_CATEGORIES = {
  CLASSIC: 'classic',
  REACTION: 'reaction',
  ADVICE: 'advice',
  COMPARISON: 'comparison',
  STORY: 'story',
  TRENDING: 'trending'
}

export const createTemplate = (data = {}) => ({
  templateId: data.templateId || Date.now(),
  name: data.name || '',
  imageUrl: data.imageUrl || '',
  category: data.category || TEMPLATE_CATEGORIES.CLASSIC,
  description: data.description || '',
  popularity: data.popularity || 0,
  active: data.active !== undefined ? data.active : true,
  createdAt: data.createdAt || new Date().toISOString(),
  ...data
})

// API Response Types
export const createApiResponse = (success = false, data = null, error = null) => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString()
})

// Payment Types
export const PAYMENT_TYPES = {
  SUBSCRIPTION: 'subscription',
  CREDITS: 'credits'
}

export const createPaymentIntent = (data = {}) => ({
  type: data.type || PAYMENT_TYPES.CREDITS,
  amount: data.amount || 0,
  currency: data.currency || 'usd',
  userId: data.userId || null,
  metadata: data.metadata || {},
  ...data
})

// Social Sharing Types
export const SHARE_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  REDDIT: 'reddit',
  TELEGRAM: 'telegram',
  WHATSAPP: 'whatsapp',
  CLIPBOARD: 'clipboard',
  DOWNLOAD: 'download'
}

export const createShareEvent = (data = {}) => ({
  memeId: data.memeId || null,
  platform: data.platform || '',
  userId: data.userId || null,
  timestamp: data.timestamp || new Date().toISOString(),
  ...data
})

// App State Types
export const APP_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error'
}

export const createAppState = (data = {}) => ({
  status: data.status || APP_STATES.IDLE,
  message: data.message || '',
  data: data.data || null,
  error: data.error || null,
  ...data
})

// Form Types
export const createMemeGenerationForm = (data = {}) => ({
  prompt: data.prompt || '',
  template: data.template || null,
  style: data.style || MEME_STYLES.MODERN,
  variations: data.variations || 1,
  ...data
})

// Analytics Types
export const createAnalyticsEvent = (data = {}) => ({
  event: data.event || '',
  category: data.category || 'user',
  label: data.label || '',
  value: data.value || null,
  userId: data.userId || null,
  timestamp: data.timestamp || new Date().toISOString(),
  metadata: data.metadata || {},
  ...data
})

// Error Types
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  API: 'api',
  AUTHENTICATION: 'authentication',
  PAYMENT: 'payment',
  UNKNOWN: 'unknown'
}

export const createError = (data = {}) => ({
  type: data.type || ERROR_TYPES.UNKNOWN,
  message: data.message || 'An error occurred',
  code: data.code || null,
  details: data.details || null,
  timestamp: data.timestamp || new Date().toISOString(),
  ...data
})

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePrompt = (prompt) => {
  return prompt && prompt.trim().length >= 3 && prompt.trim().length <= 500
}

export const validateTemplate = (template) => {
  return !template || (template.templateId && template.name)
}

export const validateStyle = (style) => {
  return Object.values(MEME_STYLES).includes(style)
}

// Default data
export const DEFAULT_TEMPLATES = [
  createTemplate({
    templateId: 'drake-pointing',
    name: 'Drake Pointing',
    category: TEMPLATE_CATEGORIES.COMPARISON,
    description: 'Classic Drake meme for comparing two things',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    popularity: 100
  }),
  createTemplate({
    templateId: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    category: TEMPLATE_CATEGORIES.STORY,
    description: 'Man looking at another woman while his girlfriend looks disapproving',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    popularity: 95
  }),
  createTemplate({
    templateId: 'woman-yelling-cat',
    name: 'Woman Yelling at Cat',
    category: TEMPLATE_CATEGORIES.REACTION,
    description: 'Woman pointing and yelling at confused cat',
    imageUrl: 'https://i.imgflip.com/345v97.jpg',
    popularity: 90
  }),
  createTemplate({
    templateId: 'this-is-fine',
    name: 'This is Fine',
    category: TEMPLATE_CATEGORIES.REACTION,
    description: 'Dog sitting in burning room saying "This is fine"',
    imageUrl: 'https://i.imgflip.com/26am.jpg',
    popularity: 85
  }),
  createTemplate({
    templateId: 'expanding-brain',
    name: 'Expanding Brain',
    category: TEMPLATE_CATEGORIES.ADVICE,
    description: 'Four-panel brain expansion meme',
    imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
    popularity: 80
  })
]

export const DEFAULT_USER = createUser({
  subscriptionTier: USER_SUBSCRIPTION_TIERS.FREE,
  generationCredits: 3
})
