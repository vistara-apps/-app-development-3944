import React from 'react'
import { X, Zap, Crown, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

const UpgradePrompt = ({ onClose }) => {
  const { upgradeToProUser, buyCredits } = useApp()

  const handleUpgradeToPro = () => {
    upgradeToProUser()
    onClose()
  }

  const handleBuyCredits = (amount) => {
    buyCredits(amount)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-lg p-6 w-full max-w-md animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Upgrade Your Plan</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Pro Plan */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
            <div className="flex items-center space-x-2 mb-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Pro Plan</h3>
              <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                RECOMMENDED
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-green-400" />
                <span>Unlimited meme generation</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-green-400" />
                <span>Custom styles & templates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-green-400" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-green-400" />
                <span>No watermarks</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-white">$5</span>
              <span className="text-white/60">/month</span>
            </div>

            <button
              onClick={handleUpgradeToPro}
              className="w-full button-primary text-white font-medium py-2 px-4 rounded-lg"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Credit Options */}
          <div className="space-y-2">
            <h3 className="font-medium text-white mb-3">Or buy credits:</h3>
            
            <button
              onClick={() => handleBuyCredits(10)}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-left transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">10 Credits</div>
                  <div className="text-white/60 text-sm">$2.50 ($0.25 each)</div>
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </button>

            <button
              onClick={() => handleBuyCredits(25)}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-left transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">25 Credits</div>
                  <div className="text-white/60 text-sm">$5.00 ($0.20 each)</div>
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </button>
          </div>
        </div>

        <p className="text-xs text-white/50 text-center mt-4">
          All payments are processed securely through Stripe
        </p>
      </div>
    </div>
  )
}

export default UpgradePrompt