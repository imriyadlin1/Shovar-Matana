"use client";

import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { ChatSuggestions } from "./ChatSuggestions";

export type ChatMessageRow = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
};

type Props = {
  conversationId: string;
  currentUserId: string;
  initialMessages: ChatMessageRow[];
};

function sortedMerge(prev: ChatMessageRow[], row: ChatMessageRow): ChatMessageRow[] {
  if (prev.some((m) => m.id === row.id)) return prev;
  return [...prev, row].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
}

function formatMessageTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const ySame =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (ySame) {
    return (
      "אתמול · " +
      d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
    );
  }
  return d.toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });
}

function DemoConversationPreview({ onTap }: { onTap: (text: string) => void }) {
  const rows = [
    { side: "them" as const, text: "היי — השובר עדיין בתוקף? ראיתי שווי של 450 ₪." },
    { side: "me" as const, text: "כן. אפשר לסגור על 380 היום אם מעבירים מיד." },
    { side: "them" as const, text: "מתאים. מעביר אחרי שתשלח את הקוד בצ׳אט הזה בלבד." },
  ];
  return (
    <div className="mb-4 space-y-3 rounded-2xl border border-dashed border-slate-300/90 bg-surface/90 px-3 py-4 shadow-sm" dir="rtl">
      <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
        דוגמה לשיחת סגירה · לחצו על הודעה כדי להשתמש בה
      </p>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`flex w-full ${r.side === "me" ? "justify-end" : "justify-start"}`}
          >
            <button
              type="button"
              onClick={() => onTap(r.text)}
              className={`max-w-[min(88%,28rem)] cursor-pointer rounded-2xl px-3.5 py-2.5 text-start text-[0.8125rem] leading-snug opacity-[0.92] transition hover:opacity-100 hover:shadow-md ${
                r.side === "me"
                  ? "rounded-br-md bg-brand/88 text-white ring-1 ring-brand/15 hover:bg-brand"
                  : "rounded-bl-md border border-slate-200/90 bg-surface-muted text-ink hover:border-brand/30"
              }`}
            >
              {r.text}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConversationChat({ conversationId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<ChatMessageRow[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  function insertText(text: string) {
    setBody(text);
    textareaRef.current?.focus();
  }

  useEffect(() => {
    const supabase = createClient();
    const channel: RealtimeChannel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as ChatMessageRow;
          if (!row?.id) return;
          setMessages((prev) => sortedMerge(prev, row));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, lastMessageId, conversationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSending(false);
      setError("הסשן פג — התחברו מחדש ונסו שוב.");
      return;
    }

    const { data, error: insErr } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: text,
      })
      .select("id, body, sender_id, created_at")
      .single();

    setSending(false);
    if (insErr) {
      setError("לא הצלחנו לשלוח. בדקו חיבור או הרשאות.");
      return;
    }
    if (data) setMessages((prev) => sortedMerge(prev, data as ChatMessageRow));
    setBody("");
  }

  const showDemo = messages.length === 0;

  return (
    <div className="mt-8 flex flex-1 flex-col gap-0 md:mt-10">
      <div
        dir="ltr"
        className="flex max-h-[min(58vh,540px)] min-h-[220px] flex-col gap-3 overflow-y-auto rounded-3xl border border-slate-200/80 bg-surface-muted/50 p-4 shadow-inner md:p-5"
      >
        {showDemo && <DemoConversationPreview onTap={insertText} />}
        {showDemo && (
          <div
            dir="rtl"
            className="flex flex-col items-center justify-center gap-2 border-t border-slate-200/60 px-4 py-8 text-center"
          >
            <p className="text-sm font-bold text-brand-deep">עכשיו תורכם</p>
            <p className="max-w-sm text-xs leading-relaxed text-ink-muted">
              לחצו על דוגמה למעלה או בחרו משפט מוכן למטה — או כתבו משהו משלכם.
            </p>
          </div>
        )}
        <ul className="flex flex-col gap-3.5">
          {messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <li
                key={m.id}
                className={`flex w-full max-w-full ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`w-fit max-w-[min(88%,30rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    mine
                      ? "rounded-br-md bg-brand text-white ring-1 ring-brand/20"
                      : "rounded-bl-md border border-slate-200/90 bg-surface text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words" dir="auto">
                    {m.body}
                  </p>
                  <p
                    className={`mt-2 text-[0.6875rem] tabular-nums ${
                      mine ? "text-white/80" : "text-ink-faint"
                    }`}
                    dir="ltr"
                  >
                    {formatMessageTime(m.created_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-3xl border border-slate-200/80 bg-surface p-5 shadow-sm md:mt-6 md:p-6"
      >
        <label className="label-form" htmlFor="chat-body">
          <span className="eyebrow text-ink-muted">שלחו — סוגרים פה</span>
          <span className="sr-only">גוף ההודעה</span>
        </label>

        <ChatSuggestions onSelect={insertText} />

        <textarea
          ref={textareaRef}
          id="chat-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          disabled={sending}
          dir="rtl"
          className="input-field min-h-[6rem] resize-y disabled:opacity-55"
          placeholder="כתבו הודעה או לחצו על משפט מוכן למעלה…"
        />
        {error && (
          <p className="alert-danger py-3 text-sm" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-start pt-1">
          <button type="submit" disabled={sending || !body.trim()} className="btn-primary min-w-[7.5rem] disabled:opacity-50">
            {sending ? "שולחים…" : "שלחו עכשיו"}
          </button>
        </div>
      </form>
    </div>
  );
}
