# MemeFlow AI Deployment Guide 🚀

This guide covers deploying MemeFlow AI to production environments.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent React/Vite support with automatic deployments.

#### Steps:

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
   VITE_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

### Option 2: Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for continuous deployment

3. **Configure Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all the required environment variables

### Option 3: Docker

1. **Build Docker Image**
   ```bash
   docker build -t memeflow-ai .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_SUPABASE_URL=your_supabase_url \
     -e VITE_SUPABASE_ANON_KEY=your_supabase_key \
     # ... other env vars
     memeflow-ai
   ```

## 🗄️ Database Setup (Production)

### Supabase Production Setup

1. **Create Production Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project for production
   - Choose a strong database password

2. **Run Database Schema**
   ```sql
   -- Copy and paste the contents of database-schema.sql
   -- into the Supabase SQL Editor
   ```

3. **Configure Authentication**
   - Enable email authentication
   - Set up OAuth providers (Google, GitHub, etc.)
   - Configure email templates

4. **Set Up Row Level Security**
   - RLS policies are included in the schema
   - Test with different user roles

5. **Configure Storage**
   - Create storage buckets for meme images
   - Set up appropriate policies

## 💳 Payment Setup (Production)

### Stripe Configuration

1. **Create Production Account**
   - Switch to live mode in Stripe dashboard
   - Complete account verification

2. **Create Products and Prices**
   ```bash
   # Pro Monthly Subscription
   stripe products create --name "MemeFlow AI Pro" --description "Unlimited meme generation"
   stripe prices create --product prod_xxx --unit-amount 500 --currency usd --recurring interval=month
   
   # Credit Packages
   stripe products create --name "5 Credits" --description "5 meme generation credits"
   stripe prices create --product prod_xxx --unit-amount 125 --currency usd
   ```

3. **Set Up Webhooks**
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `invoice.payment_succeeded`

4. **Update Environment Variables**
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   STRIPE_SECRET_KEY=sk_live_xxx (server-side only)
   ```

## 🔐 Security Checklist

### Environment Variables
- [ ] All sensitive keys are server-side only
- [ ] No API keys in client-side code
- [ ] Environment variables are properly configured

### Database Security
- [ ] Row Level Security enabled
- [ ] Proper user permissions
- [ ] Database backups configured
- [ ] SSL connections enforced

### API Security
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] API keys rotated regularly

### Application Security
- [ ] HTTPS enforced
- [ ] Content Security Policy configured
- [ ] XSS protection enabled
- [ ] Secure headers configured

## 📊 Monitoring & Analytics

### Application Monitoring

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor page views and performance

2. **Supabase Monitoring**
   - Monitor database performance
   - Set up alerts for high usage

3. **Custom Analytics**
   ```javascript
   // Track custom events
   import { createAnalyticsEvent } from './types'
   
   const trackMemeGeneration = (userId, template, style) => {
     // Send to analytics service
   }
   ```

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/react
   ```

2. **Configure Error Boundaries**
   ```javascript
   import * as Sentry from "@sentry/react"
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production"
   })
   ```

## 🚀 Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   ```

2. **Code Splitting**
   ```javascript
   // Lazy load components
   const MemeGenerator = lazy(() => import('./components/MemeGenerator'))
   ```

3. **Image Optimization**
   - Use WebP format when possible
   - Implement lazy loading
   - Optimize template images

### Caching Strategy

1. **Static Assets**
   - Cache CSS/JS files for 1 year
   - Use content hashing for cache busting

2. **API Responses**
   - Cache template data
   - Implement stale-while-revalidate

3. **CDN Configuration**
   - Use Vercel's global CDN
   - Configure appropriate cache headers

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          # ... other env vars
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📋 Pre-Launch Checklist

### Technical
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] SSL certificates configured
- [ ] Domain name configured
- [ ] CDN configured
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Backups configured

### Business
- [ ] Stripe products created
- [ ] Payment flows tested
- [ ] Terms of service updated
- [ ] Privacy policy updated
- [ ] Support email configured
- [ ] Analytics tracking set up

### Testing
- [ ] End-to-end tests passing
- [ ] Payment flows tested
- [ ] Social sharing tested
- [ ] Mobile responsiveness verified
- [ ] Performance benchmarks met
- [ ] Security scan completed

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   - Ensure all variables start with `VITE_`
   - Check for typos in variable names
   - Verify values are properly escaped

3. **Database Connection Issues**
   - Check Supabase project URL
   - Verify API key permissions
   - Test connection in Supabase dashboard

4. **Payment Issues**
   - Verify Stripe keys are for correct environment
   - Check webhook endpoints
   - Test with Stripe test cards

### Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

🎉 **Congratulations!** Your MemeFlow AI app is now live and ready to generate viral memes!

Remember to monitor your app's performance and user feedback to continuously improve the experience.
