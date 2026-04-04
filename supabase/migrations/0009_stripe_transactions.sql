-- Stripe Connect + Transactions

-- Add Stripe fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false;

-- Helper: check if seller accepts Stripe payments (bypasses profiles RLS)
CREATE OR REPLACE FUNCTION public.seller_accepts_stripe(p_seller_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT stripe_onboarding_complete FROM public.profiles WHERE id = p_seller_id),
    false
  );
$$;

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ils',
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment','paid','code_sent','completed','disputed','refunded','cancelled')),
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX transactions_buyer_idx ON public.transactions (buyer_id, created_at DESC);
CREATE INDEX transactions_seller_idx ON public.transactions (seller_id, created_at DESC);
CREATE INDEX transactions_asset_idx ON public.transactions (asset_id);
CREATE INDEX transactions_stripe_cs_idx ON public.transactions (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY transactions_select_own ON public.transactions
  FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin(auth.uid())
  );

CREATE POLICY transactions_insert_buyer ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY transactions_update_participant ON public.transactions
  FOR UPDATE USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin(auth.uid())
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_transaction_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_transaction_timestamp();

-- Notifications on transaction status change
CREATE OR REPLACE FUNCTION public.notify_transaction_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_asset_title TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title INTO v_asset_title FROM public.assets WHERE id = NEW.asset_id;

    IF NEW.status = 'paid' THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        NEW.seller_id, 'payment_received',
        'התקבל תשלום!',
        'הקונה שילם עבור "' || COALESCE(v_asset_title, 'שובר') || '". שלחו את הקוד.',
        '/messages'
      );
    ELSIF NEW.status = 'completed' THEN
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        NEW.seller_id, 'transaction_complete',
        'העסקה הושלמה!',
        'הכסף עבור "' || COALESCE(v_asset_title, 'שובר') || '" הועבר אליכם.',
        '/dashboard/transactions'
      );
      INSERT INTO public.notifications (user_id, type, title, body, link)
      VALUES (
        NEW.buyer_id, 'transaction_complete',
        'העסקה הושלמה בהצלחה',
        'אישרתם קבלת "' || COALESCE(v_asset_title, 'שובר') || '". תודה!',
        '/dashboard/transactions'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_transaction_status_change
  AFTER UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.notify_transaction_update();
