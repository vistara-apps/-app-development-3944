-- MemeFlow AI Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
    generation_credits INTEGER NOT NULL DEFAULT 3,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE public.templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'classic' CHECK (category IN ('classic', 'reaction', 'advice', 'comparison', 'story', 'trending')),
    description TEXT,
    popularity INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memes table
CREATE TABLE public.memes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    template TEXT,
    style TEXT DEFAULT 'modern',
    ipfs_hash TEXT,
    ipfs_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (for tracking Stripe subscriptions)
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    price_id TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (for tracking credit purchases)
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT NOT NULL DEFAULT 'usd',
    credits_purchased INTEGER,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table (for tracking usage)
CREATE TABLE public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_memes_user_id ON public.memes(user_id);
CREATE INDEX idx_memes_created_at ON public.memes(created_at DESC);
CREATE INDEX idx_memes_public ON public.memes(is_public) WHERE is_public = true;
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_popularity ON public.templates(popularity DESC);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memes_updated_at BEFORE UPDATE ON public.memes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment template popularity
CREATE OR REPLACE FUNCTION increment_template_popularity(template_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.templates 
    SET popularity = popularity + 1 
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own memes
CREATE POLICY "Users can view own memes" ON public.memes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memes" ON public.memes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memes" ON public.memes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memes" ON public.memes FOR DELETE USING (auth.uid() = user_id);

-- Anyone can view public memes
CREATE POLICY "Anyone can view public memes" ON public.memes FOR SELECT USING (is_public = true);

-- Templates are readable by everyone
CREATE POLICY "Templates are viewable by everyone" ON public.templates FOR SELECT USING (active = true);

-- Users can view their own subscriptions and transactions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Analytics policies (users can insert their own events)
CREATE POLICY "Users can insert own analytics" ON public.analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default templates
INSERT INTO public.templates (name, image_url, category, description, popularity) VALUES
('Drake Pointing', 'https://i.imgflip.com/30b1gx.jpg', 'comparison', 'Classic Drake meme for comparing two things', 100),
('Distracted Boyfriend', 'https://i.imgflip.com/1ur9b0.jpg', 'story', 'Man looking at another woman while his girlfriend looks disapproving', 95),
('Woman Yelling at Cat', 'https://i.imgflip.com/345v97.jpg', 'reaction', 'Woman pointing and yelling at confused cat', 90),
('This is Fine', 'https://i.imgflip.com/26am.jpg', 'reaction', 'Dog sitting in burning room saying "This is fine"', 85),
('Expanding Brain', 'https://i.imgflip.com/1jwhww.jpg', 'advice', 'Four-panel brain expansion meme', 80),
('Two Buttons', 'https://i.imgflip.com/1g8my4.jpg', 'comparison', 'Person sweating over two button choices', 75),
('Change My Mind', 'https://i.imgflip.com/24y43o.jpg', 'advice', 'Steven Crowder sitting at table with sign', 70),
('Surprised Pikachu', 'https://i.imgflip.com/2kbn1e.jpg', 'reaction', 'Pikachu with surprised expression', 65),
('Mocking SpongeBob', 'https://i.imgflip.com/1otk96.jpg', 'reaction', 'SpongeBob mocking with alternating caps', 60),
('Success Kid', 'https://i.imgflip.com/1bhk.jpg', 'classic', 'Baby making fist pump gesture', 55);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
