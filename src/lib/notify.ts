import "server-only";

export type NewPreorderNotice = {
  id: number;
  fullName: string;
  phone: string;
  quantity: number;
  total: number;
  locale: string;
};

/**
 * Yeni sipariş bildirimi. Şimdilik yalnızca Telegram destekleniyor ve
 * TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID tanımlı değilse hiçbir şey yapmaz.
 * E-posta gibi başka bir kanal eklemek için bu fonksiyonu genişletmek yeterli.
 */
export async function notifyNewPreorder(p: NewPreorderNotice) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `📚 Yeni ön sipariş #${p.id}`,
    `${p.fullName} · ${p.phone}`,
    `Tüm koleksiyon × ${p.quantity} = ${p.total.toLocaleString("tr-TR")} TL`,
    `Dil: ${p.locale}`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) console.error("Telegram bildirimi gönderilemedi:", res.status);
  } catch (err) {
    console.error("Telegram bildirimi gönderilemedi:", err);
  }
}
