-- צ'אט: לאפשר למשתתף קיים להוסיף משתתף נוסף לאותה שיחה (למשל קונה מוסיף מוכר)
-- ולאפשר לראות את כל משתתפי השיחה אם אתה משתתף

DROP POLICY IF EXISTS conv_part_select ON public.conversation_participants;
CREATE POLICY conv_part_select ON public.conversation_participants
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS conv_part_insert ON public.conversation_participants;
CREATE POLICY conv_part_insert ON public.conversation_participants
  FOR INSERT WITH CHECK (
    public.is_admin(auth.uid())
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS conversations_asset_context_idx
  ON public.conversations (context_type, context_id)
  WHERE context_type = 'asset' AND context_id IS NOT NULL;
