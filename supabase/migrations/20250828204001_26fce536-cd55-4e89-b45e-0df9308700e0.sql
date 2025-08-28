-- Check what are valid values for result field by looking at constraint
SELECT 
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conname LIKE '%journal_entries%' 
  AND contype = 'c';