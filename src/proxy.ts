import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { internalToUg, ugToInternal } from "@/i18n/paths";
import { ADMIN_COOKIE } from "@/lib/auth-constants";

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("lang")?.value;
  if (hasLocale(saved)) return saved;
  // Çerez yoksa (ilk ziyaret) tarayıcı diline bakılmaz, site Uygurca açılır.
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: hızlı ön kontrol. Asıl yetki kontrolü sayfalarda ve action'larda yapılır.
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && !request.cookies.has(ADMIN_COOKIE)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (hasLocale(first)) {
    let response = NextResponse.next();
    // Uygurca adresler: /ug/zakaz dosya yapısındaki /ug/on-siparis sayfasına yeniden yazılır;
    // eski (Türkçe adlı) Uygurca adresler yeni adrese yönlendirilir.
    if (first === "ug") {
      const second = pathname.split("/")[2];
      if (second && ugToInternal[second]) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(`/ug/${second}`, `/ug/${ugToInternal[second]}`);
        response = NextResponse.rewrite(url);
      } else if (second && internalToUg[second]) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(`/ug/${second}`, `/ug/${internalToUg[second]}`);
        return NextResponse.redirect(url, 308);
      }
    }
    if (request.cookies.get("lang")?.value !== first) {
      response.cookies.set("lang", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }

  // Dil öneki olmayan adresler: /kitaplar → /ug/kitaplar (çerezde kayıtlı dil varsa o)
  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // _next, media, statik dosyalar (uzantılı yollar) ve metadata dosyaları hariç
    "/((?!_next|media|covers|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
