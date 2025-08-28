-- Add quest achievement type and update existing achievements with proper categories
UPDATE achievement_definitions SET achievement_type = 'milestone' 
WHERE id IN ('first_pound', 'level_up', 'marathon');

UPDATE achievement_definitions SET achievement_type = 'skill' 
WHERE id IN ('value_detective', 'paycheck_pro', 'apr_unmasker', 'risk_ranger');

UPDATE achievement_definitions SET achievement_type = 'habit' 
WHERE id IN ('goal_setter', 'comeback_kid');

UPDATE achievement_definitions SET achievement_type = 'fun' 
WHERE id IN ('latte_factor', 'lemonade_tycoon', 'bogof_boss');

-- Add some quest-based achievements
INSERT INTO achievement_definitions (id, achievement_type, title, description, icon, criteria, reward_coins) VALUES
('quest_explorer', 'quest', 'Quest Explorer', 'Complete your first quest successfully', '🗺️', '{"type": "quest_completion", "count": 1}', 25),
('quest_master', 'quest', 'Quest Master', 'Complete 5 different quests', '⚔️', '{"type": "quest_completion", "count": 5}', 75),
('treasure_hunter', 'quest', 'Treasure Hunter', 'Find a rare treasure in any quest', '💎', '{"type": "rare_treasure_found", "count": 1}', 50)

ON CONFLICT (id) DO UPDATE SET
  achievement_type = EXCLUDED.achievement_type,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  criteria = EXCLUDED.criteria,
  reward_coins = EXCLUDED.reward_coins;