-- Add concepts column to quests table to store learning concepts
ALTER TABLE public.quests 
ADD COLUMN concepts TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add some sample data with concepts to existing quests
UPDATE public.quests 
SET concepts = CASE 
    WHEN id = 'basket-durability' THEN ARRAY['Comparison Shopping', 'Value Assessment', 'Quality vs Price']
    WHEN id = 'bread-bank' THEN ARRAY['Saving', 'Interest', 'Banking']
    WHEN id = 'juice-shrinkflation' THEN ARRAY['Inflation', 'Consumer Awareness', 'Price Analysis']
    WHEN id = 'momo-bakery-payslip' THEN ARRAY['Income', 'Payslip Reading', 'Employment']
    WHEN id = 'pancake-inflation' THEN ARRAY['Inflation', 'Price Changes', 'Economic Impact']
    WHEN id = 'pippa-self-employment' THEN ARRAY['Self-Employment', 'Business Income', 'Entrepreneurship']
    ELSE ARRAY['Budgeting', 'Financial Literacy']
END;