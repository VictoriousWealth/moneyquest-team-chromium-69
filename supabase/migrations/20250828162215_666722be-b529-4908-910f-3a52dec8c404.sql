-- Remove the Time Travel Market quest
DELETE FROM quests WHERE id = 'quest_inflation_1';

-- Update the order so "The Juice That Shrunk" comes before "Pancake Price Storm"
UPDATE quests 
SET order_in_section = 1
WHERE id = 'juice-shrinkflation';

UPDATE quests 
SET order_in_section = 2  
WHERE id = 'pancake-inflation';