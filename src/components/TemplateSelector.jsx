import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  const templates = [
    {
      id: 1,
      name: 'Distracted Boyfriend',
      imageUrl: 'https://picsum.photos/150/100?random=1',
      category: 'Trending'
    },
    {
      id: 2,
      name: 'Drake Pointing',
      imageUrl: 'https://picsum.photos/150/100?random=2',
      category: 'Classic'
    },
    {
      id: 3,
      name: 'Woman Yelling at Cat',
      imageUrl: 'https://picsum.photos/150/100?random=3',
      category: 'Popular'
    },
    {
      id: 4,
      name: 'This is Fine',
      imageUrl: 'https://picsum.photos/150/100?random=4',
      category: 'Reaction'
    },
    {
      id: 5,
      name: 'Expanding Brain',
      imageUrl: 'https://picsum.photos/150/100?random=5',
      category: 'Progressive'
    },
    {
      id: 6,
      name: 'Surprised Pikachu',
      imageUrl: 'https://picsum.photos/150/100?random=6',
      category: 'Reaction'
    }
  ]

  return (
    <div className="glass-effect rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Choose Template</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`group relative rounded-lg overflow-hidden transition-all ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-purple-400 scale-105'
                : 'hover:scale-105'
            }`}
          >
            <div className="aspect-video relative">
              <img
                src={template.imageUrl}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="text-white text-xs font-medium text-left">
                  {template.name}
                </div>
                <div className="text-white/70 text-xs">
                  {template.category}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button className="text-white/60 hover:text-white text-sm flex items-center space-x-1">
          <span>View all templates</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TemplateSelector