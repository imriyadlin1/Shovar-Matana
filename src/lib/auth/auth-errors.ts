/** מיפוי שגיאות Supabase Auth להודעות בעברית — login / signup */

/** זיהוי מגבלת קצב שליחת מייל (למשל Signup / Resend) */
export function isAuthRateLimitMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("rate limit") ||
    m.includes("email rate limit") ||
    m.includes("too many requests") ||
    m.includes("too_many_requests") ||
    m.includes("too many") ||
    m.includes("over_email_send") ||
    m.includes("over request") ||
    m.includes("429") ||
    m.includes("exceeded")
  );
}

/** הודעה אחידה למגבלת קצב — לטוסט אימות */
export function authRateLimitToHebrew(): string {
  return "נשלחו יותר מדי בקשות במייל. זו מגבלה זמנית של המערכת — חכו כמה דקות ונסו שוב.";
}

export function signupErrorToHebrew(message: string): string {
  const m = message.toLowerCase();
  if (isAuthRateLimitMessage(message)) {
    return authRateLimitToHebrew();
  }
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("user already") ||
    m.includes("email address is already")
  ) {
    return "האימייל הזה כבר רשום. אפשר להתחבר, או לאפס סיסמה מהמסך הזה.";
  }
  if (m.includes("password") && (m.includes("least") || m.includes("short") || m.includes("weak"))) {
    return "הסיסמה קצרה מדי או חלשה מדי. נסו שילוב ארוך יותר.";
  }
  if (m.includes("invalid") && m.includes("email")) {
    return "כתובת האימייל לא נראית תקינה. בדקו הקלדה.";
  }
  return "משהו השתבש בהרשמה. נסו שוב בעוד רגע.";
}

export function loginErrorToHebrew(message: string): string {
  const m = message.toLowerCase();
  if (isAuthRateLimitMessage(message)) {
    return authRateLimitToHebrew();
  }
  if (
    m.includes("email not confirmed") ||
    m.includes("email_not_confirmed") ||
    m.includes("not confirmed") ||
    m.includes("confirm your email") ||
    (m.includes("signup") && m.includes("not completed"))
  ) {
    return "האימייל עדיין לא אושר — בדקו את תיבת הדואר וגם את הספאם, ולחצו על קישור האישור. רק אחרי זה אפשר להתחבר. לא מופיע מייל? חזרו להרשמה ולחצו על שליחת מייל האישור מחדש.";
  }
  if (
    m.includes("invalid login") ||
    m.includes("invalid credentials") ||
    m.includes("invalid_grant") ||
    m.includes("wrong password") ||
    m.includes("invalid password")
  ) {
    return "אימייל או סיסמה לא מתאימים. בדקו או אפסו סיסמה ב-Supabase אם הוגדר.";
  }
  if (m.includes("invalid") && m.includes("email")) {
    return "כתובת האימייל לא תקינה.";
  }
  return "לא הצלחנו להתחבר. נסו שוב.";
}

export function authResendErrorToHebrew(message: string): string {
  if (isAuthRateLimitMessage(message)) {
    return authRateLimitToHebrew();
  }
  return "לא הצלחנו לשלוח עכשיו. נסו שוב בעוד רגע; אם זה נמשך, בדקו שהאימייל נכון.";
}

/** מגבלת קצב לפי הודעה או קוד סטטוס HTTP מהלקוח */
export function isAuthRateLimitError(err: { message: string; status?: number }): boolean {
  if (typeof err.status === "number" && err.status === 429) return true;
  return isAuthRateLimitMessage(err.message);
}
