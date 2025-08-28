-- Add image_url column to quests table for custom quest images
ALTER TABLE public.quests 
ADD COLUMN image_url TEXT;

-- Update "The Juice That Shrunk" quest with the main juice stand image
UPDATE public.quests 
SET image_url = '/lovable-uploads/3d24a1f5-6261-49c1-8237-6f1c0cff430c.png'
WHERE id = 'juice-shrinkflation' OR title LIKE '%Juice%' OR title LIKE '%Momo%';