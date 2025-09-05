import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

let stripePromise = null

if (STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
}

export const getStripe = () => stripePromise

// Pricing configuration
export const PRICING = {
  PRO_MONTHLY: {
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    amount: 500, // $5.00 in cents
    currency: 'usd',
    interval: 'month',
    name: 'Pro Monthly',
    features: [
      'Unlimited meme generations',
      'Custom styles and templates',
      'Priority support',
      'High-resolution downloads',
      'Commercial usage rights'
    ]
  },
  CREDITS_5: {
    priceId: 'price_credits_5', // Replace with actual Stripe price ID
    amount: 125, // $1.25 in cents (5 credits at $0.25 each)
    currency: 'usd',
    credits: 5,
    name: '5 Credits'
  },
  CREDITS_10: {
    priceId: 'price_credits_10',
    amount: 225, // $2.25 in cents (10% discount)
    currency: 'usd',
    credits: 10,
    name: '10 Credits'
  },
  CREDITS_25: {
    priceId: 'price_credits_25',
    amount: 500, // $5.00 in cents (20% discount)
    currency: 'usd',
    credits: 25,
    name: '25 Credits'
  }
}

export const createCheckoutSession = async (priceId, userId, successUrl, cancelUrl) => {
  if (!stripePromise) {
    throw new Error('Stripe is not configured')
  }

  try {
    // In a real app, this would call your backend API
    // For now, we'll simulate the checkout process
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    
    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

export const createSubscription = async (userId) => {
  try {
    const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${window.location.origin}/pricing`
    
    await createCheckoutSession(
      PRICING.PRO_MONTHLY.priceId,
      userId,
      successUrl,
      cancelUrl
    )
  } catch (error) {
    console.error('Subscription creation error:', error)
    throw error
  }
}

export const purchaseCredits = async (creditPackage, userId) => {
  try {
    const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&type=credits&amount=${creditPackage.credits}`
    const cancelUrl = `${window.location.origin}/pricing`
    
    await createCheckoutSession(
      creditPackage.priceId,
      userId,
      successUrl,
      cancelUrl
    )
  } catch (error) {
    console.error('Credit purchase error:', error)
    throw error
  }
}

// Mock functions for development (replace with real backend calls)
export const mockCreateSubscription = async (userId) => {
  console.log('Mock: Creating subscription for user', userId)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true, subscriptionId: 'sub_mock_' + Date.now() }
}

export const mockPurchaseCredits = async (credits, userId) => {
  console.log('Mock: Purchasing', credits, 'credits for user', userId)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true, credits, transactionId: 'txn_mock_' + Date.now() }
}
