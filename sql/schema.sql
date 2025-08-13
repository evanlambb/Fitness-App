-- Create fitness_signups table
CREATE TABLE IF NOT EXISTS fitness_signups (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    gym_name VARCHAR(255),
    training_level VARCHAR(50),
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'landing_page',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_fitness_signups_email ON fitness_signups(email);

-- Create index on signup_date for analytics
CREATE INDEX IF NOT EXISTS idx_fitness_signups_signup_date ON fitness_signups(signup_date);

-- Add Row Level Security (RLS)
ALTER TABLE fitness_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting new signups (allow anyone to sign up)
CREATE POLICY "Anyone can insert fitness signups" ON fitness_signups
    FOR INSERT WITH CHECK (true);

-- Create policy for reading signups (only authenticated users can read - for admin dashboard later)
CREATE POLICY "Only authenticated users can view fitness signups" ON fitness_signups
    FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_fitness_signups_updated_at 
    BEFORE UPDATE ON fitness_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for analytics (aggregate data without exposing personal info)
CREATE OR REPLACE VIEW fitness_signup_stats AS
SELECT 
    DATE_TRUNC('day', signup_date) as signup_day,
    COUNT(*) as signup_count,
    source
FROM fitness_signups 
GROUP BY DATE_TRUNC('day', signup_date), source
ORDER BY signup_day DESC;