import axios from 'axios'

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY
const PINATA_BASE_URL = 'https://api.pinata.cloud'

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  console.warn('Pinata API keys not found. IPFS storage will be disabled.')
}

const pinataClient = axios.create({
  baseURL: PINATA_BASE_URL,
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY
  }
})

export const uploadImageToIPFS = async (imageUrl, metadata = {}) => {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.warn('Pinata not configured, skipping IPFS upload')
    return { success: false, error: 'IPFS not configured' }
  }

  try {
    // First, fetch the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBlob = await imageResponse.blob()
    
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', imageBlob, `meme-${Date.now()}.png`)
    
    // Add metadata
    const pinataMetadata = {
      name: metadata.name || `MemeFlow AI - ${Date.now()}`,
      keyvalues: {
        app: 'MemeFlow AI',
        type: 'meme',
        prompt: metadata.prompt || '',
        template: metadata.template || '',
        style: metadata.style || '',
        createdAt: new Date().toISOString(),
        ...metadata.customData
      }
    }
    
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata))
    
    // Upload to Pinata
    const response = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const ipfsHash = response.data.IpfsHash
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

    return {
      success: true,
      ipfsHash,
      ipfsUrl,
      pinataUrl: `https://pinata.cloud/pinatapin/${ipfsHash}`
    }
  } catch (error) {
    console.error('Pinata upload error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || error.message
    }
  }
}

export const uploadMetadataToIPFS = async (metadata) => {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.warn('Pinata not configured, skipping metadata upload')
    return { success: false, error: 'IPFS not configured' }
  }

  try {
    const pinataMetadata = {
      name: `MemeFlow AI Metadata - ${Date.now()}`,
      keyvalues: {
        app: 'MemeFlow AI',
        type: 'metadata',
        createdAt: new Date().toISOString()
      }
    }

    const response = await pinataClient.post('/pinning/pinJSONToIPFS', metadata, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_metadata': JSON.stringify(pinataMetadata)
      }
    })

    const ipfsHash = response.data.IpfsHash
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

    return {
      success: true,
      ipfsHash,
      ipfsUrl,
      pinataUrl: `https://pinata.cloud/pinatapin/${ipfsHash}`
    }
  } catch (error) {
    console.error('Pinata metadata upload error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || error.message
    }
  }
}

export const createMemeNFTMetadata = (meme, ipfsImageUrl) => {
  return {
    name: `MemeFlow AI - ${meme.prompt.substring(0, 50)}...`,
    description: `AI-generated meme created with MemeFlow AI. Prompt: "${meme.prompt}"`,
    image: ipfsImageUrl,
    attributes: [
      {
        trait_type: 'Generator',
        value: 'MemeFlow AI'
      },
      {
        trait_type: 'Template',
        value: meme.template || 'Custom'
      },
      {
        trait_type: 'Style',
        value: meme.style || 'Modern'
      },
      {
        trait_type: 'Created',
        value: new Date(meme.createdAt).toLocaleDateString()
      }
    ],
    external_url: 'https://memeflow.ai',
    animation_url: null,
    background_color: null
  }
}

export const pinMemeToIPFS = async (meme) => {
  try {
    // Upload image to IPFS
    const imageResult = await uploadImageToIPFS(meme.imageUrl, {
      name: `MemeFlow AI - ${meme.prompt.substring(0, 30)}`,
      prompt: meme.prompt,
      template: meme.template,
      style: meme.style
    })

    if (!imageResult.success) {
      return imageResult
    }

    // Create and upload NFT metadata
    const nftMetadata = createMemeNFTMetadata(meme, imageResult.ipfsUrl)
    const metadataResult = await uploadMetadataToIPFS(nftMetadata)

    if (!metadataResult.success) {
      return metadataResult
    }

    return {
      success: true,
      image: imageResult,
      metadata: metadataResult,
      nftMetadata
    }
  } catch (error) {
    console.error('Error pinning meme to IPFS:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Mock function for development
export const mockPinToIPFS = async (imageUrl, metadata = {}) => {
  console.log('Mock: Pinning to IPFS', { imageUrl, metadata })
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15)
  return {
    success: true,
    ipfsHash: mockHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
    pinataUrl: `https://pinata.cloud/pinatapin/${mockHash}`
  }
}
