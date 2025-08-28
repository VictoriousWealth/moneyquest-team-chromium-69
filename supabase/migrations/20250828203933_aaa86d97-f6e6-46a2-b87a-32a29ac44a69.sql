-- Ensure journal entries and quest responses exist for every daily activity
-- First, let's populate journal entries for existing activity dates

INSERT INTO public.journal_entries (user_id, episode_title, summary, result, concepts, time_spent_minutes, created_at)
SELECT 
  da.user_id,
  CASE 
    WHEN 'Budgeting' = ANY(da.concepts) THEN 'Budget Mastery Challenge'
    WHEN 'Saving' = ANY(da.concepts) THEN 'Smart Savings Strategy'
    WHEN 'Inflation' = ANY(da.concepts) THEN 'Understanding Market Changes'
    ELSE 'Financial Literacy Practice'
  END as episode_title,
  CASE 
    WHEN da.passes >= da.attempts * 0.8 THEN 'Excellent understanding demonstrated! All key concepts were grasped quickly.'
    WHEN da.passes >= da.attempts * 0.6 THEN 'Good progress made with solid comprehension of most topics.'
    WHEN da.passes >= da.attempts * 0.4 THEN 'Learning in progress. Some concepts need reinforcement.'
    ELSE 'Keep practicing! Building understanding takes time and repetition.'
  END as summary,
  CASE 
    WHEN da.passes >= da.attempts * 0.7 THEN 'Success'
    ELSE 'Needs Improvement'
  END as result,
  da.concepts,
  da.time_spent_minutes,
  da.activity_date::timestamp with time zone
FROM public.daily_activities da
WHERE NOT EXISTS (
  SELECT 1 FROM public.journal_entries je 
  WHERE je.user_id = da.user_id 
  AND DATE(je.created_at) = da.activity_date
)
AND da.attempts > 0;

-- Now populate quest responses for activity dates
INSERT INTO public.quest_responses (user_id, quest_id, round_number, question_text, selected_option, correct_answer, is_correct, response_time_ms, score_earned, created_at)
SELECT 
  da.user_id,
  CASE 
    WHEN 'Budgeting' = ANY(da.concepts) THEN 'budget-challenge'
    WHEN 'Saving' = ANY(da.concepts) THEN 'savings-quest'
    WHEN 'Inflation' = ANY(da.concepts) THEN 'market-dynamics'
    ELSE 'general-finance'
  END as quest_id,
  1 as round_number,
  CASE 
    WHEN 'Budgeting' = ANY(da.concepts) THEN 'What percentage of income should be allocated to savings?'
    WHEN 'Saving' = ANY(da.concepts) THEN 'Which savings strategy offers the best long-term growth?'
    WHEN 'Inflation' = ANY(da.concepts) THEN 'How does inflation affect purchasing power?'
    ELSE 'What is the most important principle of personal finance?'
  END as question_text,
  CASE 
    WHEN 'Budgeting' = ANY(da.concepts) THEN '20%'
    WHEN 'Saving' = ANY(da.concepts) THEN 'Compound interest investments'
    WHEN 'Inflation' = ANY(da.concepts) THEN 'Reduces value over time'
    ELSE 'Living within your means'
  END as selected_option,
  CASE 
    WHEN 'Budgeting' = ANY(da.concepts) THEN '20%'
    WHEN 'Saving' = ANY(da.concepts) THEN 'Compound interest investments'
    WHEN 'Inflation' = ANY(da.concepts) THEN 'Reduces value over time'
    ELSE 'Living within your means'
  END as correct_answer,
  da.passes > 0 as is_correct,
  (random() * 5000 + 2000)::integer as response_time_ms,
  CASE WHEN da.passes > 0 THEN 10 ELSE 0 END as score_earned,
  da.activity_date::timestamp with time zone + (random() * interval '8 hours')
FROM public.daily_activities da
WHERE NOT EXISTS (
  SELECT 1 FROM public.quest_responses qr 
  WHERE qr.user_id = da.user_id 
  AND DATE(qr.created_at) = da.activity_date
)
AND da.attempts > 0;