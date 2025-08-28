-- Insert achievement definitions for existing badges
INSERT INTO achievement_definitions (id, achievement_type, title, description, icon, criteria, reward_coins) VALUES
-- Milestone badges
('first_pound', 'milestone', 'First Pound', 'Pass your first episode', '🎯', '{"type": "episode_completion", "count": 1}', 10),
('level_up', 'milestone', 'Level-Up Learner', 'Pass 10 episodes', '🎓', '{"type": "episode_completion", "count": 10}', 50),
('marathon', 'milestone', 'Marathon Learner', 'Pass 25 episodes', '🏃‍♂️', '{"type": "episode_completion", "count": 25}', 100),

-- Skill badges  
('value_detective', 'skill', 'Value Detective', 'Choose the best unit price 5 times', '🔍', '{"type": "unit_price_selection", "count": 5}', 25),
('paycheck_pro', 'skill', 'Paycheck Pro', 'Decode a full payslip, including NI and tax', '💰', '{"type": "payslip_completion", "count": 1}', 30),
('apr_unmasker', 'skill', 'APR Unmasker', 'Pick the cheaper loan plan 3 times', '🎭', '{"type": "loan_comparison", "count": 3}', 20),
('risk_ranger', 'skill', 'Risk Ranger', 'Build a diversified portfolio in the Stock Market Maze', '🎯', '{"type": "portfolio_diversification", "count": 1}', 40),

-- Habit badges
('goal_setter', 'habit', 'Goal Setter', 'Set and meet a weekly goal', '🎯', '{"type": "weekly_goal_completion", "count": 1}', 15),
('comeback_kid', 'habit', 'Comeback Kid', 'Pass an episode that you previously failed', '🔄', '{"type": "failed_episode_completion", "count": 1}', 20),

-- Fun badges
('latte_factor', 'fun', 'Latte Factor', 'Oops! Blew the budget on small purchases', '☕', '{"type": "budget_overspend", "count": 1}', 5),
('lemonade_tycoon', 'fun', 'Lemonade Tycoon', 'Make over £20 profit in the Lemonade Stand', '🍋', '{"type": "lemonade_profit", "amount": 20}', 50),
('bogof_boss', 'fun', 'BOGOF Boss', 'Win big using multi-buy or unit-price logic', '🛒', '{"type": "bulk_purchase_optimization", "count": 1}', 30)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  criteria = EXCLUDED.criteria,
  reward_coins = EXCLUDED.reward_coins;