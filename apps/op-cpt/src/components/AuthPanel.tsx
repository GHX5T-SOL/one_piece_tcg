"use client";

import { FormEvent, useState } from "react";
import { AtSign, BadgeCheck, MessageCircle, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const oauthProviders = [
  { id: "google", label: "Continue with Google" },
  { id: "discord", label: "Continue with Discord" }
] as const;

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

  async function signInWithProvider(provider: (typeof oauthProviders)[number]["id"]) {
    if (!supabase) {
      setStatus("OAuth is ready in the UI, but Supabase environment variables are not configured yet.");
      return;
    }

    setStatus(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    });

    if (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="auth-panel">
      <div>
        <p className="kicker">Member beta access</p>
        <h1>Sign in to The Vault Room</h1>
        <p>
          Create a collector profile, track your portfolio, join events, save watchlists, list cards for sale and build points. Live
          accounts switch on once the production Supabase OAuth project is connected.
        </p>
        <div className="auth-benefit-row">
          <span>
            <BadgeCheck aria-hidden size={16} />
            Portfolio privacy
          </span>
          <span>
            <Sparkles aria-hidden size={16} />
            Member points
          </span>
          <span>
            <AtSign aria-hidden size={16} />
            Trade identity
          </span>
        </div>
      </div>

      <div className="auth-stack">
        <div className="oauth-grid">
          {oauthProviders.map((provider) => (
            <button key={provider.id} onClick={() => void signInWithProvider(provider.id)} type="button">
              {provider.label}
            </button>
          ))}
          <a href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
            <MessageCircle aria-hidden size={16} />
            Join by WhatsApp
          </a>
        </div>

        <form className="auth-form" onSubmit={sendMagicLink}>
          <label htmlFor="email">Email magic link</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your email address"
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
      </div>
    </section>
  );
}
