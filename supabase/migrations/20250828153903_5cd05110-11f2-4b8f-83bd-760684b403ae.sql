-- Create curriculum_sections table
CREATE TABLE public.curriculum_sections (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    curriculum_order INTEGER NOT NULL UNIQUE,
    concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on curriculum_sections
ALTER TABLE public.curriculum_sections ENABLE ROW LEVEL SECURITY;

-- Create policy for public reading of curriculum sections
CREATE POLICY "Anyone can view curriculum sections" 
ON public.curriculum_sections 
FOR SELECT 
USING (true);

-- Add curriculum_section_id and order_in_section to quests table
ALTER TABLE public.quests 
ADD COLUMN curriculum_section_id INTEGER REFERENCES public.curriculum_sections(id),
ADD COLUMN order_in_section INTEGER DEFAULT 1;

-- Insert the 16 curriculum sections based on your curriculum map
INSERT INTO public.curriculum_sections (title, description, curriculum_order, concepts) VALUES
('Needs vs Wants', 'Learn to distinguish between essential needs and optional wants in budgeting decisions', 1, ARRAY['Budgeting', 'Decision Making', 'Priority Setting']),
('Envelope Budgeting', 'Master goal-setting and budget allocation using the envelope method', 2, ARRAY['Goal Setting', 'Budget Planning', 'Money Management']),
('Inflation & Value', 'Understand how prices change over time and affect purchasing power', 3, ARRAY['Inflation', 'Value Assessment', 'Economic Awareness']),
('Payslip Basics', 'Decode payslips including gross/net pay, National Insurance, and tax codes', 4, ARRAY['Income', 'Tax', 'National Insurance', 'Employment']),
('Saving & Compound Interest', 'Compare simple vs compound interest and build saving strategies', 5, ARRAY['Saving', 'Interest', 'Compound Growth']),
('Phone Plans & Subscriptions', 'Recognize hidden costs, APR in disguise, and cooling-off periods', 6, ARRAY['APR', 'Subscriptions', 'Consumer Rights']),
('Debit vs Credit', 'Understand payment methods and avoid minimum payment traps', 7, ARRAY['Credit', 'Debit', 'Debt Management']),
('Online Shopping & Returns', 'Master unit pricing and understand return policies', 8, ARRAY['Unit Pricing', 'Consumer Rights', 'Comparison Shopping']),
('Scams & Fraud', 'Identify phishing attempts and too-good-to-be-true offers', 9, ARRAY['Fraud Prevention', 'Online Safety', 'Critical Thinking']),
('Opportunity Cost & Trade-offs', 'Make informed decisions by understanding what you give up', 10, ARRAY['Opportunity Cost', 'Decision Making', 'Trade-offs']),
('Risk vs Reward', 'Introduction to risk assessment and basic diversification', 11, ARRAY['Risk Management', 'Diversification', 'Investment Basics']),
('Insurance Basics', 'Understand excess, premiums, and protection strategies', 12, ARRAY['Insurance', 'Risk Management', 'Protection']),
('Charity & Giving', 'Learn how charitable giving fits into personal budgets', 13, ARRAY['Charity', 'Social Responsibility', 'Budget Impact']),
('Carbon & Eco Choices', 'Explore the cost implications of environmentally conscious decisions', 14, ARRAY['Environmental Impact', 'Cost Analysis', 'Sustainability']),
('Rent & Bills', 'Simulate managing rental costs and household bills', 15, ARRAY['Housing Costs', 'Bill Management', 'Fixed Expenses']),
('Part-time Job Planning', 'Calculate earnings considering hours, rates, and deductions', 16, ARRAY['Employment Planning', 'Wage Calculation', 'Deductions']);

-- Update existing quests to link to appropriate curriculum sections
UPDATE public.quests 
SET curriculum_section_id = CASE 
    WHEN id = 'pancake-inflation' THEN 3  -- Inflation & Value
    WHEN id = 'juice-shrinkflation' THEN 3  -- Inflation & Value  
    WHEN id = 'bread-bank' THEN 5  -- Saving & Compound Interest
    WHEN id = 'basket-durability' THEN 8  -- Online Shopping & Returns (unit pricing)
    WHEN id = 'momo-bakery-payslip' THEN 4  -- Payslip Basics
    WHEN id = 'pippa-self-employment' THEN 16  -- Part-time Job Planning (closest fit)
END,
order_in_section = CASE 
    WHEN id = 'pancake-inflation' THEN 1
    WHEN id = 'juice-shrinkflation' THEN 2  
    WHEN id = 'bread-bank' THEN 1
    WHEN id = 'basket-durability' THEN 1
    WHEN id = 'momo-bakery-payslip' THEN 1
    WHEN id = 'pippa-self-employment' THEN 1
END;

-- Add trigger for updated_at
CREATE TRIGGER update_curriculum_sections_updated_at
    BEFORE UPDATE ON public.curriculum_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();