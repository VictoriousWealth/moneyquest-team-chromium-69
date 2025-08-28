-- Remove duplicate Alex Johnson profiles, keeping the original one
-- Keep user_id: 5c35a972-c2ee-4b1c-a7de-e34ec80f625e (the oldest one)
-- Remove the two newer duplicates

-- Delete related data first for the duplicate accounts
DELETE FROM achievements WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM daily_activities WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM game_states WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM journal_entries WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM quest_responses WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM streaks WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM student_progress WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM transactions WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');
DELETE FROM user_quest_progress WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');

-- Now delete the duplicate profiles
DELETE FROM profiles WHERE user_id IN ('75a0596e-b0e3-42eb-bb96-7b81dc34ca40', '848c9b58-da87-4c68-9d77-298ee2bf78b3');