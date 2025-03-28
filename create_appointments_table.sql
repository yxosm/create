-- Drop existing policies and triggers
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;
DROP TRIGGER IF EXISTS enforce_daily_appointment_limit ON appointments;
DROP TRIGGER IF EXISTS validate_appointment_input ON appointments;
DROP FUNCTION IF EXISTS check_daily_appointment_limit();
DROP FUNCTION IF EXISTS validate_appointment_input();

-- Drop and recreate the appointments table
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL CHECK (name ~* '^[A-Za-z\s]{2,100}$'),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone text NOT NULL CHECK (phone ~* '^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$'),
  car_model text NOT NULL,
  preferred_date timestamp with time zone NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  user_id uuid REFERENCES auth.users(id),
  request_date DATE DEFAULT CURRENT_DATE
);

-- Create function to validate input
CREATE OR REPLACE FUNCTION validate_appointment_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate name (letters and spaces only, 2-100 chars)
  IF NEW.name !~ '^[A-Za-z\s]{2,100}$' THEN
    RAISE EXCEPTION 'Name must contain only letters and spaces, between 2 and 100 characters';
  END IF;

  -- Validate car_model is not empty
  IF NEW.car_model IS NULL OR length(trim(NEW.car_model)) = 0 THEN
    RAISE EXCEPTION 'Car model is required';
  END IF;

  -- Validate message (max 1000 chars, no HTML/script tags)
  IF NEW.message IS NOT NULL AND (length(NEW.message) > 1000 OR NEW.message !~ '^[^<>]*$') THEN
    RAISE EXCEPTION 'Message must be less than 1000 characters and cannot contain HTML tags';
  END IF;

  -- Validate preferred_date is not in the past (using Eastern Time)
  IF NEW.preferred_date < (CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York')::date THEN
    RAISE EXCEPTION 'Appointment date cannot be in the past';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for input validation
CREATE TRIGGER validate_appointment_input
BEFORE INSERT OR UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION validate_appointment_input();

-- Create function to check daily appointment limit
CREATE OR REPLACE FUNCTION check_daily_appointment_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM appointments
    WHERE user_id = NEW.user_id
    AND request_date = CURRENT_DATE
  ) >= 3 THEN
    RAISE EXCEPTION 'Daily appointment limit (3) reached. Please try again tomorrow.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily limit
CREATE TRIGGER enforce_daily_appointment_limit
BEFORE INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION check_daily_appointment_limit();

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own appointments"
ON appointments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointments"
ON appointments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
ON appointments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
ON appointments FOR DELETE
USING (auth.uid() = user_id);

