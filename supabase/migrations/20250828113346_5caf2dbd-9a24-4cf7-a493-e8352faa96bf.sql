-- Add missing quest achievements and ensure all are properly categorized
INSERT INTO achievement_definitions (id, achievement_type, title, description, icon, criteria, reward_coins) VALUES
('pancake_pro', 'quest', 'Pancake Pro', 'Complete the Pancake Inflation quest', '🥞', '{"type": "quest_completion", "quest_name": "Pancake Inflation"}', 30),
('payslip_pro', 'quest', 'Payslip Pro', 'Successfully completed Momo''s Summer Job Dilemma and mastered understanding payslips!', '📄', '{"type": "quest_completion", "quest_name": "Momo Summer Job Dilemma"}', 35)

ON CONFLICT (id) DO UPDATE SET
  achievement_type = EXCLUDED.achievement_type,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  criteria = EXCLUDED.criteria,
  reward_coins = EXCLUDED.reward_coins;