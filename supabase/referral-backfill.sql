-- Backfill referral codes for enrollments that don't have one yet.
-- Uses the same LCA-XXXXX format as the app.
DO $$
DECLARE
  e RECORD;
  new_code TEXT;
  code_taken BOOLEAN;
BEGIN
  FOR e IN SELECT id FROM enrollments WHERE referral_code IS NULL OR referral_code = '' LOOP
    LOOP
      new_code := 'LCA-' || upper(substring('ABCDEFGHJKLMNPQRSTUVWXYZ23456789' FROM floor(random()*32+1)::int FOR 1))
                  || upper(substring('ABCDEFGHJKLMNPQRSTUVWXYZ23456789' FROM floor(random()*32+1)::int FOR 1))
                  || upper(substring('ABCDEFGHJKLMNPQRSTUVWXYZ23456789' FROM floor(random()*32+1)::int FOR 1))
                  || upper(substring('ABCDEFGHJKLMNPQRSTUVWXYZ23456789' FROM floor(random()*32+1)::int FOR 1))
                  || upper(substring('ABCDEFGHJKLMNPQRSTUVWXYZ23456789' FROM floor(random()*32+1)::int FOR 1));
      SELECT EXISTS(SELECT 1 FROM enrollments WHERE referral_code = new_code) INTO code_taken;
      EXIT WHEN NOT code_taken;
    END LOOP;
    UPDATE enrollments SET referral_code = new_code WHERE id = e.id;
  END LOOP;
END $$;

SELECT count(*) AS enrollments_with_code FROM enrollments WHERE referral_code IS NOT NULL AND referral_code <> '';
