-- Add last_read_at to conversation_participants for unread badge tracking

ALTER TABLE public.conversation_participants
ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMPTZ;

-- Allow participants to update their own row (for marking read)
DROP POLICY IF EXISTS conv_part_update_own ON public.conversation_participants;
CREATE POLICY conv_part_update_own ON public.conversation_participants
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
