/*
  # Life Link Blood Donation Management System - Database Schema

  ## Overview
  Creates the complete database structure for a blood donation management system
  that connects blood donors with those in need.

  ## New Tables

  ### 1. `users` Table
  Stores all registered user information including authentication and profile details.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique user identifier linked to auth.users
  - `name` (text) - User's full name
  - `email` (text, unique) - User's email address for login
  - `phone` (text) - Contact phone number
  - `blood_group` (text) - Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
  - `location` (text) - City or area of residence
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. `donors` Table
  Tracks blood donation availability and history for each user who registers as a donor.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique donor record identifier
  - `user_id` (uuid, foreign key) - References users.id
  - `availability` (boolean) - Current donation availability status
  - `last_donation_date` (date, nullable) - Date of last blood donation
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security Implementation

  ### Row Level Security (RLS)
  Both tables have RLS enabled to ensure data protection and privacy.

  ### `users` Table Policies
  1. **Public Read Access** - Anyone can view basic user/donor information (needed for blood search)
  2. **Authenticated Insert** - Only authenticated users can create their profile
  3. **Owner Update** - Users can only update their own profile
  4. **Owner Delete** - Users can only delete their own account

  ### `donors` Table Policies
  1. **Public Read Access** - Anyone can search for available donors
  2. **Owner Insert** - Authenticated users can create their donor profile
  3. **Owner Update** - Users can only update their own donor availability
  4. **Owner Delete** - Users can only delete their own donor record

  ## Important Notes
  - Email uniqueness is enforced at the database level
  - User IDs are linked to Supabase auth.users for authentication
  - Foreign key constraint ensures data integrity between users and donors
  - Timestamps are automatically managed with defaults
  - All sensitive operations require authentication
  - Public can search donors but cannot modify data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  blood_group text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  availability boolean DEFAULT true,
  last_donation_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON users FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for donors table
CREATE POLICY "Anyone can view donors"
  ON donors FOR SELECT
  USING (true);

CREATE POLICY "Users can create their donor profile"
  ON donors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own donor profile"
  ON donors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own donor profile"
  ON donors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.id = auth.uid()
    )
  );

-- Create index for faster blood group searches
CREATE INDEX IF NOT EXISTS idx_users_blood_group ON users(blood_group);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_donors_availability ON donors(availability);
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);