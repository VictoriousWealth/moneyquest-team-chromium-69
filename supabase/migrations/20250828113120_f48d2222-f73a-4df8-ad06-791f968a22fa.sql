-- Fix category assignments - move quest-related achievements to quest category
UPDATE achievement_definitions SET achievement_type = 'quest' 
WHERE id IN ('paycheck_pro', 'risk_ranger', 'lemonade_tycoon');

-- Update their descriptions to be more quest-focused
UPDATE achievement_definitions SET 
  description = 'Complete the Payslip Master quest to decode NI and tax'
WHERE id = 'paycheck_pro';

UPDATE achievement_definitions SET 
  description = 'Complete the Stock Market Maze quest successfully'
WHERE id = 'risk_ranger';

UPDATE achievement_definitions SET 
  description = 'Complete the Lemonade Stand quest with high profit'
WHERE id = 'lemonade_tycoon';