"use client";

import { useSearchParams } from "next/navigation";
import { PreorderForm } from "./PreorderForm";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof PreorderForm> & { slugToId: Record<string, number> };

/** /on-siparis?set=<slug> ile gelindiyse o seti önceden işaretler. */
export function PreorderFromUrl({ slugToId, ...props }: Props) {
  const slug = useSearchParams().get("set");
  const id = slug ? slugToId[slug] : undefined;
  return <PreorderForm {...props} defaultSetIds={id ? [id] : undefined} />;
}
