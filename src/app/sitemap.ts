import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://renuvion.com.ua", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
