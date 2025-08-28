-- Clean up duplicate achievements for Alex Johnson using only valid achievement definition IDs
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
        
        -- Insert a reasonable set of unique achievements for Alex Johnson using valid definition IDs
        INSERT INTO achievements (user_id, achievement_definition_id, achievement_type, title, description, reward_coins, achievement_data)
        VALUES 
        (alex_user_id, 'first_quest', 'milestone', 'First Steps', 'Complete your first quest.', 10, '{"awarded_by": "system", "timestamp": "2025-08-01T10:00:00Z"}'),
        (alex_user_id, 'juice_master', 'quest', 'Juice Detective', 'Master the juice stand business.', 15, '{"awarded_by": "system", "timestamp": "2025-08-05T14:30:00Z"}'),
        (alex_user_id, 'penny_saver', 'skill', 'Penny Saver', 'Learn to save money effectively.', 20, '{"awarded_by": "system", "timestamp": "2025-08-10T16:45:00Z"}'),
        (alex_user_id, 'weekly_warrior', 'streak', 'Weekly Warrior', 'Maintain a weekly learning streak.', 25, '{"awarded_by": "system", "timestamp": "2025-08-15T12:20:00Z"}'),
        (alex_user_id, 'basket_weaver', 'skill', 'Smart Shopper', 'Make smart purchasing decisions.', 30, '{"awarded_by": "system", "timestamp": "2025-08-20T09:15:00Z"}');
    END IF;
END $$;