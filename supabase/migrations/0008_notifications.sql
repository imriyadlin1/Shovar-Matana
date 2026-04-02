-- In-app notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX notifications_unread_idx ON public.notifications (user_id) WHERE is_read = false;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY notifications_update_own ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY notifications_insert_system ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Trigger: notify asset owner when a new conversation is created about their asset
CREATE OR REPLACE FUNCTION public.notify_owner_new_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_asset RECORD;
  v_buyer_name TEXT;
BEGIN
  IF NEW.context_type = 'asset' AND NEW.context_id IS NOT NULL THEN
    SELECT id, title, owner_id INTO v_asset
    FROM public.assets
    WHERE id = NEW.context_id;

    IF v_asset.owner_id IS NOT NULL THEN
      SELECT COALESCE(p.full_name, p.email, 'משתמש')
      INTO v_buyer_name
      FROM public.conversation_participants cp
      JOIN public.profiles p ON p.id = cp.user_id
      WHERE cp.conversation_id = NEW.id AND cp.user_id <> v_asset.owner_id
      LIMIT 1;

      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        v_asset.owner_id,
        'new_chat',
        'מישהו מתעניין בשובר שלכם',
        COALESCE(v_buyer_name, 'משתמש') || ' פתח צ׳אט על "' || v_asset.title || '"',
        '/messages'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_conversation_notify
  AFTER INSERT ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.notify_owner_new_conversation();
