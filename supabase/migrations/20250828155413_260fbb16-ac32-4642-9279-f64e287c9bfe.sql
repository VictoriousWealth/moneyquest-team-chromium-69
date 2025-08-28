-- Create dummy quests for all curriculum sections (fixed typo)

-- Needs vs Wants (Section 1)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_needs_wants_1', 'The Shopping Mall Dilemma', 'Help Maya decide between a new gaming console and saving for college at the local mall.', 'Greenfield Mall', 'Maya the Student', 50, 100, ARRAY['Needs vs Wants', 'Priority Setting'], 1, 1),
('quest_needs_wants_2', 'Birthday Money Blues', 'Alex received $100 for their birthday. Guide them through smart spending choices.', 'Hometown Square', 'Alex the Teen', 40, 80, ARRAY['Needs vs Wants', 'Smart Spending'], 1, 2);

-- Envelope Budgeting (Section 2)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_envelope_1', 'The Digital Envelope Challenge', 'Set up Jamie''s first budget using the envelope method for their part-time job income.', 'Digital Banking Plaza', 'Jamie the Worker', 60, 120, ARRAY['Envelope Budgeting', 'Income Allocation'], 2, 1),
('quest_envelope_2', 'Monthly Budget Rescue', 'Help Sam fix their overspending problem using envelope budgeting strategies.', 'Financial Planning Center', 'Sam the Spender', 55, 110, ARRAY['Envelope Budgeting', 'Expense Control'], 2, 2);

-- Inflation & Value (Section 3)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_inflation_1', 'Time Travel Market', 'Compare prices from 2020 vs 2025 to understand how inflation affects purchasing power.', 'Time Market District', 'Dr. Economics', 70, 140, ARRAY['Inflation', 'Purchasing Power', 'Value'], 3, 1),
('quest_inflation_2', 'The Penny Candy Crisis', 'Investigate why your favorite candy now costs twice as much as last year.', 'Sweet Shop Lane', 'Mr. Candy Keeper', 45, 90, ARRAY['Inflation', 'Price Changes'], 3, 2);

-- Payslip Basics (Section 4)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_payslip_1', 'First Job Paycheck Mystery', 'Decode Riley''s confusing first payslip and understand all the deductions.', 'Corporate Tower', 'Riley the Newbie', 65, 130, ARRAY['Payslip Reading', 'Tax Deductions', 'Net vs Gross'], 4, 1),
('quest_payslip_2', 'The Missing Money Case', 'Figure out why Casey''s paycheck is smaller than expected by analyzing their payslip.', 'HR Department', 'Casey the Confused', 50, 100, ARRAY['Payslip Analysis', 'Deductions'], 4, 2);

-- Saving & Compound Interest (Section 5)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_saving_1', 'The Magic Money Tree', 'Plant your savings seed and watch it grow through the power of compound interest.', 'Growth Garden Bank', 'Professor Compound', 80, 160, ARRAY['Compound Interest', 'Long-term Saving'], 5, 1),
('quest_saving_2', 'Car Fund Challenge', 'Help Taylor save for their dream car using smart saving strategies and interest rates.', 'Auto Savings Plaza', 'Taylor the Dreamer', 75, 150, ARRAY['Goal Setting', 'Interest Rates', 'Saving Strategies'], 5, 2);

-- Phone Plans & Subscriptions (Section 6)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_phone_1', 'The Great Phone Plan Hunt', 'Compare different phone plans to find the best deal for Jordan''s usage habits.', 'Telecom Valley', 'Jordan the Connected', 45, 90, ARRAY['Phone Plans', 'Comparison Shopping'], 6, 1),
('quest_phone_2', 'Subscription Trap Escape', 'Help Morgan cancel unused subscriptions that are draining their bank account.', 'Digital Subscription City', 'Morgan the Subscriber', 55, 110, ARRAY['Subscription Management', 'Recurring Costs'], 6, 2);

-- Debit vs Credit (Section 7)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_debit_credit_1', 'Card Choice Crossroads', 'Guide Avery through choosing between debit and credit cards for different purchases.', 'Payment Plaza', 'Avery the Shopper', 60, 120, ARRAY['Debit Cards', 'Credit Cards', 'Payment Methods'], 7, 1),
('quest_debit_credit_2', 'Credit Score Quest', 'Help Blake understand how credit cards affect their credit score and future.', 'Credit Castle', 'Blake the Builder', 70, 140, ARRAY['Credit Score', 'Credit Building', 'Financial Future'], 7, 2);

-- Online Shopping & Returns (Section 8)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_online_1', 'The Return Policy Puzzle', 'Navigate Cameron''s online shopping disaster and learn about return policies.', 'E-commerce District', 'Cameron the Buyer', 50, 100, ARRAY['Online Shopping', 'Return Policies', 'Consumer Rights'], 8, 1),
('quest_online_2', 'Deal Hunter Challenge', 'Help Quinn find genuine deals while avoiding fake discounts and hidden fees.', 'Bargain Boulevard', 'Quinn the Hunter', 55, 110, ARRAY['Deal Evaluation', 'Hidden Costs', 'Price Comparison'], 8, 2);

-- Scams & Fraud (Section 9)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_scam_1', 'Phishing Phone Phantom', 'Protect River from sophisticated phone and email scams targeting teenagers.', 'Cyber Security Center', 'River the Target', 80, 160, ARRAY['Phishing', 'Email Scams', 'Phone Scams'], 9, 1),
('quest_scam_2', 'Social Media Scheme Stopper', 'Help Sage identify and avoid common social media financial scams.', 'Social Network Square', 'Sage the Social', 75, 150, ARRAY['Social Media Scams', 'Online Safety', 'Fraud Prevention'], 9, 2);

-- Opportunity Cost & Trade-offs (Section 10)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_opportunity_1', 'The Concert vs Vacation Dilemma', 'Help Drew choose between seeing their favorite band or saving for a summer trip.', 'Decision Point Park', 'Drew the Decisive', 65, 130, ARRAY['Opportunity Cost', 'Trade-offs', 'Decision Making'], 10, 1),
('quest_opportunity_2', 'Part-Time vs Study Time', 'Guide Logan through balancing work hours with study time for better grades.', 'Balance Bridge', 'Logan the Learner', 60, 120, ARRAY['Time vs Money', 'Opportunity Cost', 'Life Balance'], 10, 2);

-- Risk vs Reward (Section 11)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_risk_1', 'Investment Island Adventure', 'Navigate Phoenix through their first investment choices in a safe, educational way.', 'Investment Island', 'Phoenix the Investor', 85, 170, ARRAY['Investment Risk', 'Risk Assessment', 'Reward Analysis'], 11, 1),
('quest_risk_2', 'The Cryptocurrency Conundrum', 'Help Rowan understand cryptocurrency risks before making any investment decisions.', 'Crypto Cove', 'Rowan the Researcher', 90, 180, ARRAY['Cryptocurrency', 'High Risk Investments', 'Research Skills'], 11, 2);

-- Insurance Basics (Section 12)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_insurance_1', 'The Broken Phone Backup Plan', 'Learn about insurance by helping Emery decide on phone insurance coverage.', 'Protection Plaza', 'Emery the Careful', 55, 110, ARRAY['Insurance Basics', 'Coverage Options', 'Premium vs Deductible'], 12, 1),
('quest_insurance_2', 'Car Insurance Crash Course', 'Prepare Skyler for car insurance decisions before getting their driver''s license.', 'Auto Insurance Avenue', 'Skyler the Driver', 70, 140, ARRAY['Car Insurance', 'Coverage Types', 'Risk Assessment'], 12, 2);

-- Charity & Giving (Section 13)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_charity_1', 'The Giving Game', 'Help Indigo create a personal giving plan that fits their values and budget.', 'Generosity Grove', 'Indigo the Giver', 60, 120, ARRAY['Charitable Giving', 'Budget Planning', 'Social Impact'], 13, 1),
('quest_charity_2', 'Fundraiser Finance Planning', 'Assist Sage in organizing a school fundraiser while learning about money management.', 'Community Center', 'Sage the Organizer', 65, 130, ARRAY['Fundraising', 'Event Planning', 'Community Impact'], 13, 2);

-- Carbon & Eco Choices (Section 14)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_eco_1', 'Green Spending Challenge', 'Guide Eden through making environmentally conscious spending choices on a budget.', 'Eco Market Place', 'Eden the Green', 70, 140, ARRAY['Sustainable Spending', 'Environmental Impact', 'Cost vs Benefit'], 14, 1),
('quest_eco_2', 'Carbon Footprint vs Wallet', 'Help Forest balance eco-friendly choices with their limited teenage budget.', 'Sustainability Station', 'Forest the Conscious', 65, 130, ARRAY['Carbon Footprint', 'Green Economics', 'Sustainable Living'], 14, 2);

-- Rent & Bills (Section 15)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_rent_1', 'First Apartment Reality Check', 'Prepare Dakota for the real costs of moving out with rent and utility calculations.', 'Apartment Complex', 'Dakota the Independent', 75, 150, ARRAY['Rent Calculation', 'Utility Bills', 'Living Expenses'], 15, 1),
('quest_rent_2', 'Bill Splitting Bonanza', 'Help River figure out fair ways to split bills with roommates.', 'Shared Living Space', 'River the Roommate', 60, 120, ARRAY['Bill Splitting', 'Shared Expenses', 'Roommate Finance'], 15, 2);

-- Part-time Job Planning (Section 16)
INSERT INTO quests (id, title, description, zone, npc, reward_coins, reward_xp, concepts, curriculum_section_id, order_in_section) VALUES
('quest_job_1', 'The Perfect Job Hunt', 'Help Kai find a part-time job that balances pay, hours, and their school schedule.', 'Employment District', 'Kai the Job Seeker', 80, 160, ARRAY['Job Search', 'Work-Life Balance', 'Income Planning'], 16, 1),
('quest_job_2', 'Tax Time Teaching', 'Guide Lane through their first tax filing experience as a part-time worker.', 'Tax Office Tower', 'Lane the Taxpayer', 85, 170, ARRAY['Tax Filing', 'Part-time Work', 'Tax Responsibilities'], 16, 2);