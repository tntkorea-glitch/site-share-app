import { Channel } from "./types";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ensureUniqueSlug(
  slug: string,
  channels: Channel[],
  excludeId?: string
): string {
  const others = excludeId
    ? channels.filter((c) => c.id !== excludeId)
    : channels;
  const slugs = new Set(others.map((c) => c.slug));

  if (!slugs.has(slug)) return slug;

  let i = 2;
  while (slugs.has(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}
