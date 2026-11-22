"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { login } from "@/lib/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Şifre</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-2xl border border-line bg-surface px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>
      {state?.error && <p className="text-sm font-semibold text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-coral flex w-full items-center justify-center gap-2 rounded-full py-3 font-extrabold">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
        Giriş yap
      </button>
    </form>
  );
}
