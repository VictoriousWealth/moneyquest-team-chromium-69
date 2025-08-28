-- First, populate achievement definitions for all badges
INSERT INTO public.achievement_definitions (id, title, description, achievement_type, icon, reward_coins, criteria) VALUES
-- Milestone badges
('first_pound', 'First Pound', 'Pass your first episode.', 'milestone', 'trophy', 10, '{"requirement": "pass_first_episode"}'),
('level_up', 'Level-Up Learner', 'Pass 10 episodes.', 'milestone', 'trophy', 50, '{"requirement": "pass_episodes", "count": 10}'),
('marathon', 'Marathon Learner', 'Pass 25 episodes.', 'milestone', 'trophy', 100, '{"requirement": "pass_episodes", "count": 25}'),

-- Skill badges
('value_detective', 'Value Detective', 'Choose the best unit price 5 times.', 'skill', 'search', 25, '{"requirement": "unit_price_choice", "count": 5}'),
('apr_unmasker', 'APR Unmasker', 'Pick the cheaper loan plan 3 times.', 'skill', 'eye', 30, '{"requirement": "loan_choice", "count": 3}'),

-- Quest badges
('pancake_pro', 'Pancake Pro', 'Complete the Pancake Inflation quest.', 'quest', 'star', 40, '{"requirement": "complete_quest", "quest_id": "pancake_inflation"}'),
('paycheck_pro', 'Paycheck Pro', 'Complete the Payslip Master quest to decode NI and tax.', 'quest', 'award', 60, '{"requirement": "complete_quest", "quest_id": "payslip_master"}'),
('payslip_pro', 'Payslip Pro', 'Successfully completed Momo''s Summer Job Dilemma.', 'quest', 'briefcase', 50, '{"requirement": "complete_quest", "quest_id": "summer_job"}'),
('risk_ranger', 'Risk Ranger', 'Complete the Stock Market Maze quest.', 'quest', 'trending-up', 70, '{"requirement": "complete_quest", "quest_id": "stock_market_maze"}'),
('lemonade_tycoon', 'Lemonade Tycoon', 'Complete the Lemonade Stand quest with high profit.', 'quest', 'cup-soda', 45, '{"requirement": "complete_quest", "quest_id": "lemonade_stand", "min_profit": 50}'),

-- Habit badges
('goal_setter', 'Goal Setter', 'Set and meet a weekly goal.', 'habit', 'target', 20, '{"requirement": "weekly_goal_completion"}'),
('comeback_kid', 'Comeback Kid', 'Pass an episode that you previously failed.', 'habit', 'refresh-cw', 35, '{"requirement": "retry_success"}'),

-- Fun badges
('latte_factor', 'Latte Factor', 'Oops! Blew the budget on small purchases.', 'fun', 'coffee', 15, '{"requirement": "budget_overspend", "category": "small_purchases"}'),
('bogof_boss', 'BOGOF Boss', 'Win big using multi-buy or unit-price logic.', 'fun', 'shopping-cart', 25, '{"requirement": "multibuy_savings", "min_amount": 20}')

ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
achievement_type = EXCLUDED.achievement_type,
icon = EXCLUDED.icon,
reward_coins = EXCLUDED.reward_coins,
criteria = EXCLUDED.criteria;