-- Clean up duplicate achievements for Alex Johnson
-- First, get Alex Johnson's user_id
DO $$
DECLARE
    alex_user_id UUID;
BEGIN
    -- Get Alex Johnson's user ID
    SELECT user_id INTO alex_user_id 
    FROM profiles 
    WHERE username = 'Alex Johnson';
    
    -- Only proceed if Alex Johnson exists
    IF alex_user_id IS NOT NULL THEN
        -- Delete all achievements for Alex Johnson first
        DELETE FROM achievements 
        WHERE user_id = alex_user_id;
        
        -- Insert a reasonable set of unique achievements for Alex Johnson
        INSERT INTO achievements (user_id, achievement_definition_id, achievement_type, title, description, reward_coins, achievement_data)
        VALUES 
        (alex_user_id, 'first_pound', 'milestone', 'First Pound', 'Pass your first episode.', 10, '{"awarded_by": "system", "timestamp": "2025-08-01T10:00:00Z"}'),
        (alex_user_id, 'goal_setter', 'milestone', 'Goal Setter', 'Set and meet a weekly goal.', 15, '{"awarded_by": "system", "timestamp": "2025-08-05T14:30:00Z"}'),
        (alex_user_id, 'value_detective', 'skill', 'Value Detective', 'Choose the best unit price 5 times.', 20, '{"awarded_by": "system", "timestamp": "2025-08-10T16:45:00Z"}'),
        (alex_user_id, 'lemonade_tycoon', 'quest', 'Lemonade Tycoon', 'Complete the Lemonade Stand quest with high profit.', 25, '{"awarded_by": "system", "timestamp": "2025-08-15T12:20:00Z"}'),
        (alex_user_id, 'streak_master', 'streak', 'Streak Master', 'Maintain a 7-day learning streak.', 30, '{"awarded_by": "system", "timestamp": "2025-08-20T09:15:00Z"}');
    END IF;
END $$;