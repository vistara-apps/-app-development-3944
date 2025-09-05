import axios from 'axios'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1'

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Meme generation will use mock data.')
}

const openaiClient = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const generateMemeImage = async (prompt, template = null, style = 'modern') => {
  if (!OPENAI_API_KEY) {
    // Return mock data for development
    return {
      success: true,
      imageUrl: `https://picsum.photos/500/400?random=${Date.now()}`,
      revisedPrompt: prompt
    }
  }

  try {
    // Enhance the prompt based on template and style
    let enhancedPrompt = prompt
    
    if (template) {
      enhancedPrompt = `Create a meme in the style of "${template.name}": ${prompt}`
    }
    
    if (style && style !== 'modern') {
      enhancedPrompt += ` with a ${style} visual style`
    }
    
    enhancedPrompt += '. Make it funny and suitable for social media sharing. High quality, clear text, vibrant colors.'

    const response = await openaiClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url'
    })

    const imageData = response.data.data[0]
    
    return {
      success: true,
      imageUrl: imageData.url,
      revisedPrompt: imageData.revised_prompt || enhancedPrompt
    }
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message)
    
    // Return error with fallback to mock data
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to generate meme',
      imageUrl: `https://picsum.photos/500/400?random=${Date.now()}`, // Fallback
      revisedPrompt: prompt
    }
  }
}

export const generateMemeVariations = async (originalPrompt, count = 3) => {
  if (!OPENAI_API_KEY) {
    // Return mock variations
    return Array.from({ length: count }, (_, i) => ({
      success: true,
      imageUrl: `https://picsum.photos/500/400?random=${Date.now() + i}`,
      revisedPrompt: `${originalPrompt} (variation ${i + 1})`
    }))
  }

  try {
    const variations = []
    
    for (let i = 0; i < count; i++) {
      const variationPrompt = `${originalPrompt} (create a different variation, same concept but different visual approach)`
      const result = await generateMemeImage(variationPrompt)
      variations.push(result)
    }
    
    return variations
  } catch (error) {
    console.error('Error generating variations:', error)
    return []
  }
}
