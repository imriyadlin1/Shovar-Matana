-- הון כלוא — ליבת סכימה + RLS
-- הרץ דרך Supabase SQL Editor או supabase db push

-- ========== enums ==========
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.asset_status AS ENUM ('draft', 'listed', 'sold');

-- ========== profiles ==========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'fullName',
      split_part(COALESCE(NEW.email, ''), '@', 1)
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========== CMS / תוכן דינמי ==========
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'he',
  title TEXT,
  body JSONB,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles (id),
  UNIQUE (key, locale)
);

-- ========== נכסים דיגיטליים (שוברים וכו') ==========
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  nominal_value NUMERIC(14, 2) NOT NULL DEFAULT 0,
  ask_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
  category TEXT,
  expiry DATE,
  notes TEXT,
  image_path TEXT,
  status public.asset_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  contact_name TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX assets_owner_idx ON public.assets (owner_id);
CREATE INDEX assets_status_idx ON public.assets (status);
CREATE INDEX assets_category_idx ON public.assets (category);

-- ========== צ'אט ==========
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type TEXT NOT NULL DEFAULT 'asset',
  context_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX messages_conv_idx ON public.messages (conversation_id, created_at DESC);

-- ========== פונקציית עזר — אדמין ==========
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'
  );
$$;

-- ========== RLS ==========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- profiles: קוראים את של עצמם; אדמין רואה הכל
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- site_content: כולם קוראים פרסום; אדמין הכל (כתיבה דרך שרת מומלץ)
CREATE POLICY site_content_public_read ON public.site_content
  FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()));

CREATE POLICY site_content_admin_write ON public.site_content
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- assets: בעלים; רשימה ציבורית — listed; אדמין
CREATE POLICY assets_select_owner ON public.assets
  FOR SELECT USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY assets_select_listed ON public.assets
  FOR SELECT USING (status = 'listed');

CREATE POLICY assets_insert_own ON public.assets
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY assets_update_own ON public.assets
  FOR UPDATE USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY assets_delete_own ON public.assets
  FOR DELETE USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

-- conversations: משתתפים או אדמין
CREATE POLICY conv_select ON public.conversations
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY conv_insert ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY conv_part_select ON public.conversation_participants
  FOR SELECT USING (
    user_id = auth.uid() OR public.is_admin(auth.uid())
  );

CREATE POLICY conv_part_insert ON public.conversation_participants
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY conv_part_delete ON public.conversation_participants
  FOR DELETE USING (public.is_admin(auth.uid()));

-- messages: שולח או משתתף בשיחה
CREATE POLICY messages_select ON public.messages
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR sender_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY messages_insert ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
    )
  );

-- ========== Realtime (הפעלה ב-dashboard או:) ==========
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

COMMENT ON TABLE public.assets IS 'נכסים דיגיטליים לדמו/מוצר — תואם לשוברים ב-legacy';
COMMENT ON TABLE public.messages IS 'הודעות צ''אט; הרשאות לפי משתתפים';
