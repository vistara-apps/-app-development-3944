import React from 'react'
import { Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

const CreditCounter = ({ variant = 'inline' }) => {
  const { user } = useApp()

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-white">
          {user.subscriptionTier === 'pro' ? '∞' : user.generationCredits}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        <span className="text-lg font-semibold text-white">
          {user.subscriptionTier === 'pro' ? 'Unlimited' : `${user.generationCredits} Credits`}
        </span>
      </div>
      <p className="text-sm text-white/70">
        {user.subscriptionTier === 'pro' ? 'Pro Member' : 'Free Tier'}
      </p>
    </div>
  )
}

export default CreditCounter