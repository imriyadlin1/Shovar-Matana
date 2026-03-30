# Hon Klou / הון כלוא — פלטפורמה

אפליקציית **Next.js 15** + **Supabase** (Auth, Postgres, RLS, Realtime-ready).

## דרישות

- Node 20+
- פרויקט Supabase

## התקנה

```bash
cd platform
cp .env.local.example .env.local
# מלא NEXT_PUBLIC_SUPABASE_* ו-SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

## מיגרציית DB

ב-SQL Editor של Supabase הדבק את `supabase/migrations/0001_core_schema.sql` והרץ.  
אם הטריגר נכשל, החלף `EXECUTE PROCEDURE` ב-`EXECUTE FUNCTION` לפי גרסת Postgres.

### משתמש אדמין ראשון

```sql
update public.profiles
set role = 'admin'
where email = 'your@email.com';
```

## Deploy — Vercel

- Root directory: `platform`
- Environment variables: כמו ב-`.env.local.example`
- ב-Supabase Authentication → URL configuration: הוסף את כתובת הפרודקשן ל-Redirect URLs

## מבנה

- `src/app` — routes (אדמין ב-`/admin`, מוגן ב-`middleware.ts`)
- `src/lib/supabase` — clients
- `src/app/api/admin/export` — ייצוא CSV (אדמין + service role)
- האתר הסטטי הישן נשאר בתיקיית השורש `../` לעיון / מיגרציה
