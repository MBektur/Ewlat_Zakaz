import "server-only";

export const deliveryLabels: Record<string, string> = { cargo: "Kargo", pickup: "Elden teslim", post: "Posta" };

type AddressRow = {
  country: string;
  region: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string;
  postalCode: string | null;
};

const names = new Intl.DisplayNames(["tr"], { type: "region" });
export function countryName(code: string) {
  try {
    return names.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Tek satırlık okunur adres: mahalle, sokak, posta kodu şehir, bölge, ülke. */
export function formatAddress(r: AddressRow) {
  return [r.neighborhood, r.address, [r.postalCode, r.city].filter(Boolean).join(" "), r.region, countryName(r.country)]
    .filter(Boolean)
    .join(", ");
}
