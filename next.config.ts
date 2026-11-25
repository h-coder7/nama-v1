import path from "node:path";
import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./lib/routes";

/**
 * PREVIEW_EXPORT=1 builds a static export (out/) used for the review link.
 * Production (Vercel) runs as a normal Next.js app with the locale redirect.
 */
const isPreviewExport = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_PREVIEW_EXPORT: isPreviewExport ? "1" : "" },
  // Production: inline the (small) CSS into the HTML instead of 5 render-blocking requests
  // (Lighthouse mobile: ~0.8s). Not for the static review export, whose MPA rewrite needs the CSS files.
  experimental: isPreviewExport ? {} : { inlineCss: true },
  trailingSlash: true,
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "styles")],
    includePaths: [path.join(process.cwd(), "styles")],
  },
  images: isPreviewExport
    ? // Review export: no optimiser, so a custom loader picks pre-built width variants.
      { loader: "custom", loaderFile: "./lib/preview-image-loader.ts" }
    : {},
  ...(isPreviewExport
    ? { output: "export" as const }
    : {
        async redirects() {
          // Old sitemap URLs (before the Nov 2026 amendments) → new pages, both locales.
          const legacy = LEGACY_REDIRECTS.flatMap(([from, to]) =>
            ["en", "ar"].map((l) => ({ source: `/${l}${from}/`, destination: `/${l}${to}/`, permanent: true })),
          );
          return [{ source: "/", destination: "/en/", permanent: false }, ...legacy];
        },
      }),
};

export default nextConfig;
