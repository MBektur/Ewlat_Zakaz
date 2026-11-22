import { LogoMark } from "@/components/site/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { isDemo } from "@/lib/demo";

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
        {isDemo() ? (
          <p className="rounded-2xl bg-soft px-4 py-3 text-sm leading-relaxed text-body">
            Önizleme modundasınız: veri tabanı bağlı olmadığı için yönetim paneli kapalı.
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
