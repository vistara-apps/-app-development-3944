import { supabase, TABLES } from '../lib/supabase'

// User Management
export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([{
        email: userData.email,
        subscription_tier: userData.subscriptionTier || 'free',
        generation_credits: userData.generationCredits || 3,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, user: data }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: error.message }
  }
}

export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, user: data }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: error.message }
  }
}

export const updateUser = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, user: data }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: error.message }
  }
}

// Meme Management
export const saveMeme = async (memeData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.MEMES)
      .insert([{
        user_id: memeData.userId,
        prompt: memeData.prompt,
        image_url: memeData.imageUrl,
        template: memeData.template,
        style: memeData.style,
        ipfs_hash: memeData.ipfsHash || null,
        ipfs_url: memeData.ipfsUrl || null,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, meme: data }
  } catch (error) {
    console.error('Error saving meme:', error)
    return { success: false, error: error.message }
  }
}

export const getUserMemes = async (userId, limit = 20, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.MEMES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { success: true, memes: data }
  } catch (error) {
    console.error('Error fetching user memes:', error)
    return { success: false, error: error.message }
  }
}

export const getPublicMemes = async (limit = 20, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.MEMES)
      .select(`
        *,
        users:user_id (
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { success: true, memes: data }
  } catch (error) {
    console.error('Error fetching public memes:', error)
    return { success: false, error: error.message }
  }
}

// Template Management
export const getTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select('*')
      .eq('active', true)
      .order('popularity', { ascending: false })

    if (error) throw error
    return { success: true, templates: data }
  } catch (error) {
    console.error('Error fetching templates:', error)
    return { success: false, error: error.message }
  }
}

export const createTemplate = async (templateData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .insert([{
        name: templateData.name,
        image_url: templateData.imageUrl,
        category: templateData.category,
        description: templateData.description,
        popularity: 0,
        active: true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, template: data }
  } catch (error) {
    console.error('Error creating template:', error)
    return { success: false, error: error.message }
  }
}

export const updateTemplatePopularity = async (templateId) => {
  try {
    const { data, error } = await supabase
      .rpc('increment_template_popularity', { template_id: templateId })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error updating template popularity:', error)
    return { success: false, error: error.message }
  }
}

// Analytics and Stats
export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.MEMES)
      .select('id, created_at, template, style')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      totalMemes: data.length,
      memesThisMonth: data.filter(meme => {
        const memeDate = new Date(meme.created_at)
        const now = new Date()
        return memeDate.getMonth() === now.getMonth() && 
               memeDate.getFullYear() === now.getFullYear()
      }).length,
      favoriteTemplate: getMostUsedTemplate(data),
      favoriteStyle: getMostUsedStyle(data)
    }

    return { success: true, stats }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return { success: false, error: error.message }
  }
}

// Helper functions
const getMostUsedTemplate = (memes) => {
  const templateCounts = {}
  memes.forEach(meme => {
    if (meme.template) {
      templateCounts[meme.template] = (templateCounts[meme.template] || 0) + 1
    }
  })
  
  return Object.keys(templateCounts).reduce((a, b) => 
    templateCounts[a] > templateCounts[b] ? a : b, 'None'
  )
}

const getMostUsedStyle = (memes) => {
  const styleCounts = {}
  memes.forEach(meme => {
    if (meme.style) {
      styleCounts[meme.style] = (styleCounts[meme.style] || 0) + 1
    }
  })
  
  return Object.keys(styleCounts).reduce((a, b) => 
    styleCounts[a] > styleCounts[b] ? a : b, 'modern'
  )
}

// Authentication helpers
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // Create user profile
    if (data.user) {
      await createUser({
        email: data.user.email,
        subscriptionTier: 'free',
        generationCredits: 3
      })
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error('Error signing up:', error)
    return { success: false, error: error.message }
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Error signing in:', error)
    return { success: false, error: error.message }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { success: false, error: error.message }
  }
}
