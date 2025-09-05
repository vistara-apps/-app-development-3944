import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateMemeImage } from '../services/openai'
import { saveMeme, getUserMemes, getTemplates } from '../services/database'
import { pinMemeToIPFS } from '../services/pinata'
import { mockCreateSubscription, mockPurchaseCredits } from '../services/stripe'
import { DEFAULT_TEMPLATES, DEFAULT_USER, createMeme, USER_SUBSCRIPTION_TIERS } from '../types'
import toast from 'react-hot-toast'

const useMemeFlowStore = create(
  persist(
    (set, get) => ({
      // User state
      user: DEFAULT_USER,
      isAuthenticated: false,
      
      // Meme state
      memes: [],
      currentMeme: null,
      isGenerating: false,
      generationError: null,
      
      // Template state
      templates: DEFAULT_TEMPLATES,
      selectedTemplate: null,
      
      // UI state
      showUpgradeModal: false,
      showAuthModal: false,
      isLoading: false,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      updateUserCredits: (credits) => set((state) => ({
        user: { ...state.user, generationCredits: credits }
      })),
      
      upgradeUser: async () => {
        try {
          const { user } = get()
          const result = await mockCreateSubscription(user.userId)
          
          if (result.success) {
            set((state) => ({
              user: {
                ...state.user,
                subscriptionTier: USER_SUBSCRIPTION_TIERS.PRO,
                generationCredits: Infinity
              },
              showUpgradeModal: false
            }))
            toast.success('Successfully upgraded to Pro!')
            return { success: true }
          }
        } catch (error) {
          console.error('Upgrade error:', error)
          toast.error('Failed to upgrade. Please try again.')
          return { success: false, error: error.message }
        }
      },
      
      purchaseCredits: async (amount) => {
        try {
          const { user } = get()
          const result = await mockPurchaseCredits(amount, user.userId)
          
          if (result.success) {
            set((state) => ({
              user: {
                ...state.user,
                generationCredits: state.user.generationCredits + amount
              }
            }))
            toast.success(`Successfully purchased ${amount} credits!`)
            return { success: true }
          }
        } catch (error) {
          console.error('Credit purchase error:', error)
          toast.error('Failed to purchase credits. Please try again.')
          return { success: false, error: error.message }
        }
      },
      
      generateMeme: async (prompt, template = null, style = 'modern') => {
        const { user } = get()
        
        // Check credits
        if (user.generationCredits <= 0 && user.subscriptionTier === USER_SUBSCRIPTION_TIERS.FREE) {
          set({ showUpgradeModal: true })
          return { success: false, error: 'No credits remaining' }
        }
        
        set({ isGenerating: true, generationError: null })
        
        try {
          // Generate image with OpenAI
          const result = await generateMemeImage(prompt, template, style)
          
          if (result.success) {
            const newMeme = createMeme({
              userId: user.userId,
              prompt,
              imageUrl: result.imageUrl,
              template: template?.name || null,
              style
            })
            
            // Save to database (if configured)
            try {
              await saveMeme(newMeme)
            } catch (dbError) {
              console.warn('Failed to save meme to database:', dbError)
            }
            
            // Pin to IPFS (if configured)
            try {
              const ipfsResult = await pinMemeToIPFS(newMeme)
              if (ipfsResult.success) {
                newMeme.ipfsHash = ipfsResult.image.ipfsHash
                newMeme.ipfsUrl = ipfsResult.image.ipfsUrl
              }
            } catch (ipfsError) {
              console.warn('Failed to pin meme to IPFS:', ipfsError)
            }
            
            // Update state
            set((state) => ({
              memes: [newMeme, ...state.memes],
              currentMeme: newMeme,
              isGenerating: false,
              user: {
                ...state.user,
                generationCredits: state.user.subscriptionTier === USER_SUBSCRIPTION_TIERS.FREE 
                  ? Math.max(0, state.user.generationCredits - 1)
                  : state.user.generationCredits
              }
            }))
            
            toast.success('Meme generated successfully!')
            return { success: true, meme: newMeme }
          } else {
            set({ isGenerating: false, generationError: result.error })
            toast.error(result.error || 'Failed to generate meme')
            return { success: false, error: result.error }
          }
        } catch (error) {
          console.error('Meme generation error:', error)
          set({ isGenerating: false, generationError: error.message })
          toast.error('Failed to generate meme')
          return { success: false, error: error.message }
        }
      },
      
      loadUserMemes: async () => {
        const { user } = get()
        if (!user.userId) return
        
        set({ isLoading: true })
        
        try {
          const result = await getUserMemes(user.userId)
          if (result.success) {
            set({ memes: result.memes, isLoading: false })
          }
        } catch (error) {
          console.error('Failed to load user memes:', error)
          set({ isLoading: false })
        }
      },
      
      loadTemplates: async () => {
        try {
          const result = await getTemplates()
          if (result.success) {
            set({ templates: result.templates })
          }
        } catch (error) {
          console.error('Failed to load templates:', error)
          // Keep default templates on error
        }
      },
      
      selectTemplate: (template) => set({ selectedTemplate: template }),
      
      setCurrentMeme: (meme) => set({ currentMeme: meme }),
      
      showUpgrade: () => set({ showUpgradeModal: true }),
      
      hideUpgrade: () => set({ showUpgradeModal: false }),
      
      showAuth: () => set({ showAuthModal: true }),
      
      hideAuth: () => set({ showAuthModal: false }),
      
      clearError: () => set({ generationError: null }),
      
      reset: () => set({
        user: DEFAULT_USER,
        isAuthenticated: false,
        memes: [],
        currentMeme: null,
        selectedTemplate: null,
        showUpgradeModal: false,
        showAuthModal: false,
        isGenerating: false,
        generationError: null,
        isLoading: false
      })
    }),
    {
      name: 'memeflow-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        memes: state.memes.slice(0, 10), // Only persist last 10 memes
        selectedTemplate: state.selectedTemplate
      })
    }
  )
)

// Selectors for better performance
export const useUser = () => useMemeFlowStore((state) => state.user)
export const useIsAuthenticated = () => useMemeFlowStore((state) => state.isAuthenticated)
export const useMemes = () => useMemeFlowStore((state) => state.memes)
export const useCurrentMeme = () => useMemeFlowStore((state) => state.currentMeme)
export const useIsGenerating = () => useMemeFlowStore((state) => state.isGenerating)
export const useTemplates = () => useMemeFlowStore((state) => state.templates)
export const useSelectedTemplate = () => useMemeFlowStore((state) => state.selectedTemplate)
export const useShowUpgradeModal = () => useMemeFlowStore((state) => state.showUpgradeModal)
export const useShowAuthModal = () => useMemeFlowStore((state) => state.showAuthModal)

export default useMemeFlowStore
