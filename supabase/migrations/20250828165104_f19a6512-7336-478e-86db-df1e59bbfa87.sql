-- Fix unique constraints that are causing duplicate key errors
-- Make user_id unique only if not already exists for game_states table
DO $$ 
BEGIN
    -- Check if unique constraint exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'game_states_user_id_key'
    ) THEN
        ALTER TABLE game_states ADD CONSTRAINT game_states_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Same for profiles table
DO $$ 
BEGIN
    -- Check if unique constraint exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_user_id_key'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Create function to handle user registration safely
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert profile only if it doesn't exist
  INSERT INTO public.profiles (user_id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', 'Player'))
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert game state only if it doesn't exist
  INSERT INTO public.game_states (user_id, coins, day)
  VALUES (new.id, 5.00, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();