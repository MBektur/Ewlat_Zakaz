import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

/** Admin'den yüklenen kapakları sunar. Kimlik rastgele ve değişmez, uzun süre önbelleğe alınabilir. */
export async function GET(_req: Request, ctx: RouteContext<"/media/[id]">) {
  const { id } = await ctx.params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new Response("Not found", { status: 404 });
  const [row] = await db.select().from(schema.media).where(eq(schema.media.id, id));
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "content-type": row.contentType,
      "content-length": String(row.byteSize),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
