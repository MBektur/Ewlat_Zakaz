import { LogoMark } from "@/components/site/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Giriş" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[2rem] bg-surface p-8 shadow-lift">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="font-display text-xl">Ewlat Kitap</p>
            <p className="text-sm text-muted">Yönetim paneli</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
