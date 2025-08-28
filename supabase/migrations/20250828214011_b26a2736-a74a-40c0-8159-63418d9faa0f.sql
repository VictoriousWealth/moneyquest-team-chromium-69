-- Update the Pancake Price Storm quest to use the image from public/images
UPDATE quests 
SET image_url = '/images/pancake-fox.png'
WHERE id = 'pancake-inflation';