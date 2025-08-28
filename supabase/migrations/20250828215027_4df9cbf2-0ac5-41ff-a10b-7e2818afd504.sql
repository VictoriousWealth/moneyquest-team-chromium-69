-- Fix: Assign the fox image to Momo's Juice Stand quest instead of pancake quest
UPDATE quests 
SET image_url = '/images/pancake-fox.png'
WHERE id = 'juice-shrinkflation';

-- Remove the image from the pancake quest
UPDATE quests 
SET image_url = NULL
WHERE id = 'pancake-inflation';