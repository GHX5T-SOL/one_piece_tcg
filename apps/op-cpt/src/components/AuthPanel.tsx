"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const supabase = getSupabaseBrowserClient();

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase environment variables are not configured yet.");
      return;
    }

    setIsSending(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`
      }
    });
    setIsSending(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Magic link sent. Check your inbox and return to the harbor.");
    setEmail("");
  }

  return (
    <section className="auth-panel">
      <div>
        <p className="kicker">Member beta access</p>
        <h1>Sign in to OP CPT</h1>
        <p>
          Supabase magic-link auth is wired for the beta. Profiles, collection privacy, trades, RSVPs, and watchlists are protected by
          the RLS migration once the production Supabase project is connected.
        </p>
      </div>

      <form className="auth-form" onSubmit={sendMagicLink}>
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="captain@example.com"
          required
          type="email"
          value={email}
        />
        <button disabled={isSending} type="submit">
          {isSending ? "Sending..." : "Send magic link"}
        </button>
        {status ? <p role="status">{status}</p> : null}
        {!supabase ? <small>Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable live auth.</small> : null}
      </form>
    </section>
  );
}
