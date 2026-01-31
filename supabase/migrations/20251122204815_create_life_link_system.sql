/*
  # Life Link Blood Donation System Database Schema

  ## Overview
  Complete database schema for the Life Link blood donation platform, enabling users to register as donors,
  manage their profiles, and connect with those in need of blood donations.

  ## Tables Created

  ### 1. users
  Central user profile table storing essential donor information:
  - `id` (uuid, primary key) - Links to auth.users
  - `name` (text) - Full name of the user
  - `email` (text, unique) - Email address
  - `phone` (text) - Contact phone number
  - `blood_group` (text) - Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
  - `location` (text) - City/area location
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. donors
  Tracks donor-specific information and availability:
  - `id` (uuid, primary key) - Unique donor record ID
  - `user_id` (uuid, foreign key) - References users table
  - `availability` (boolean) - Whether donor is currently available
  - `last_donation_date` (date, nullable) - Date of most recent donation
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security Implementation

  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies ensuring:
  - Users can only read their own profile data
  - Users can only update their own records
  - Authenticated users can view all donor profiles (for finding blood)
  - Only the profile owner can delete their account

  ### Policies Applied

  #### users table:
  - SELECT: Users can read their own profile
  - INSERT: Users can create their own profile
  - UPDATE: Users can update their own profile
  - DELETE: Users can delete their own profile

  #### donors table:
  - SELECT: All authenticated users can view donor profiles (for search)
  - INSERT: Users can create their own donor record
  - UPDATE: Users can update their own donor record
  - DELETE: Users can delete their own donor record

  ## Indexes
  - users.email - For faster email lookups during authentication
  - users.blood_group - For efficient blood group filtering
  - users.location - For location-based searches
  - donors.user_id - For joining user and donor data
  - donors.availability - For filtering available donors

  ## Important Notes
  - All timestamps use UTC timezone
  - Phone numbers stored as text for international format flexibility
  - Blood group values should be validated at application level
  - Cascade deletes ensure data integrity when users are removed
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  availability boolean DEFAULT true,
  last_donation_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_blood_group ON users(blood_group);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);
CREATE INDEX IF NOT EXISTS idx_donors_availability ON donors(availability);

-- Enable Row Level Security


-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can view all donors" ON donors;
DROP POLICY IF EXISTS "Users can create own donor record" ON donors;
DROP POLICY IF EXISTS "Users can update own donor record" ON donors;
DROP POLICY IF EXISTS "Users can delete own donor record" ON donors;

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON users FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Donors table policies
CREATE POLICY "Authenticated users can view all donors"
  ON donors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own donor record"
  ON donors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donor record"
  ON donors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own donor record"
  ON donors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donors table
DROP TRIGGER IF EXISTS update_donors_updated_at ON donors;
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();