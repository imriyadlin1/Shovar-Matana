-- צפייה בפרופיל של משתמש שאתה משתף איתו שיחה (inbox / כותרת צ'אט)
CREATE POLICY profiles_select_conversation_peer ON public.profiles
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp_self
      INNER JOIN public.conversation_participants cp_other
        ON cp_self.conversation_id = cp_other.conversation_id
      WHERE cp_self.user_id = auth.uid()
        AND cp_other.user_id = profiles.id
    )
  );
