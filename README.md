# MemeFlow AI 🤖✨

Generate viral memes instantly with AI-powered creativity. MemeFlow AI transforms your text descriptions into shareable memes using popular templates and styles.

![MemeFlow AI](https://via.placeholder.com/800x400/667eea/ffffff?text=MemeFlow+AI)

## 🚀 Features

### Core Features
- **AI-Powered Text-to-Meme Generation**: Transform text prompts into viral memes using OpenAI's DALL-E
- **Template Library**: Choose from popular meme formats (Drake Pointing, Distracted Boyfriend, etc.)
- **Style Customization**: Apply different visual styles (modern, vintage, minimalist, etc.)
- **One-Click Social Sharing**: Share directly to Twitter, Facebook, LinkedIn, WhatsApp, and more
- **IPFS Storage**: Decentralized storage for memes using Pinata
- **Credit System**: Freemium model with micro-transactions

### Business Model
- **Free Tier**: 3 meme generations per day
- **Pro Subscription**: $5/month for unlimited generations
- **Pay-per-Meme**: $0.25 per meme for non-subscribers
- **Credit Packages**: Bulk credit purchases with discounts

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI DALL-E 3 API
- **Payments**: Stripe
- **Storage**: Pinata IPFS
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- OpenAI API key
- Stripe account (for payments)
- Pinata account (for IPFS storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/memeflow-ai.git
cd memeflow-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Pinata IPFS Configuration
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `database-schema.sql`

This will create all necessary tables, indexes, and security policies.

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app running!

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User profiles and subscription info
- **memes**: Generated memes with metadata
- **templates**: Meme template library
- **subscriptions**: Stripe subscription tracking
- **transactions**: Credit purchase history
- **analytics**: Usage analytics

See `database-schema.sql` for the complete schema.

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database schema from `database-schema.sql`
3. Configure authentication providers (optional)
4. Set up Row Level Security policies (included in schema)

### OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env` file
3. Monitor usage and costs in the OpenAI dashboard

### Stripe Setup

1. Create a Stripe account
2. Set up products and prices for:
   - Pro Monthly Subscription ($5/month)
   - Credit packages (5, 10, 25 credits)
3. Configure webhooks for payment processing
4. Add publishable key to `.env`

### Pinata Setup

1. Create a Pinata account
2. Generate API keys
3. Add keys to `.env` file
4. Configure IPFS gateway settings

## 🎨 Customization

### Adding New Templates

1. Add template data to `src/types/index.js`
2. Insert into database via Supabase dashboard
3. Templates will automatically appear in the UI

### Styling

The app uses Tailwind CSS with a custom design system:

- **Colors**: Primary (blue), Accent (orange), Surface (white)
- **Spacing**: sm (8px), md (12px), lg (20px)
- **Border Radius**: sm (6px), md (10px), lg (16px)

Modify `tailwind.config.js` to customize the design system.

### Adding New Social Platforms

1. Add platform to `src/services/social.js`
2. Implement share function
3. Add button to `ShareButtons` component
4. Update analytics tracking

## 📱 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

## 🔒 Security

- **Row Level Security**: Enabled on all Supabase tables
- **API Key Protection**: All sensitive keys are server-side only
- **Input Validation**: Prompt validation and sanitization
- **Rate Limiting**: Credit system prevents abuse
- **CORS**: Configured for production domains only

## 📊 Analytics

The app tracks:

- Meme generation events
- Social sharing activity
- User engagement metrics
- Payment conversions
- Template popularity

Analytics data is stored in the `analytics` table and can be visualized using tools like Grafana or custom dashboards.

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### E2E Testing

```bash
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@memeflow.ai

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic meme generation
- ✅ Template library
- ✅ Social sharing
- ✅ Payment system

### Phase 2 (Next)
- [ ] User authentication
- [ ] Meme history and favorites
- [ ] Advanced AI prompting
- [ ] Batch generation

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Video meme generation
- [ ] Community features
- [ ] API for developers

## 🙏 Acknowledgments

- OpenAI for DALL-E API
- Supabase for backend infrastructure
- Stripe for payment processing
- Pinata for IPFS storage
- The meme community for inspiration

---

Made with ❤️ by the MemeFlow AI team

**Generate. Share. Go Viral.** 🚀
