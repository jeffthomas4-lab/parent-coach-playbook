import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import authkit from '@workos/authkit-astro';

const ownerAuthProofEnabled = process.env.PCD_OWNER_AUTH_PROOF_ENABLED === 'true';

// Rehype plugin: decorates links in markdown content at build time.
// - External links (http/https): open in new tab, rel noopener noreferrer
// - Affiliate redirect links (/go/...): open in new tab, rel sponsored nofollow noopener
// HTML anchors already carrying these attributes are overwritten with the same
// values, so the plugin is a no-op for hand-coded cards.
function rehypeAffiliateRel() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string') {
        if (href.startsWith('/go/')) {
          node.properties.rel = ['sponsored', 'nofollow', 'noopener'];
          node.properties.target = '_blank';
        } else if (href.startsWith('http://') || href.startsWith('https://')) {
          node.properties.rel = ['noopener', 'noreferrer'];
          node.properties.target = '_blank';
        }
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://parentcoachdesk.com',
  // Astro 5 removed the 'hybrid' output. 'static' is now the default and keeps the
  // same behavior: most pages prerender, and any page with `export const prerender = false`
  // runs server-side at the edge. Used for SSR + D1 access.
  output: 'static',
  adapter: cloudflare({
    // The adapter bakes the selected Wrangler configuration into dist/server.
    // Normal builds remain staging-safe; the production wrapper sets this to
    // wrangler.production.jsonc explicitly for an auditable release artifact.
    configPath: process.env.WRANGLER_CONFIG_PATH || undefined,
    platformProxy: { enabled: true },
    // This static-heavy site prerenders thousands of content and protected preview
    // pages. Running that work through the adapter's workerd bridge exhausted the
    // default Node heap; Node prerendering keeps the build in one runtime. On-demand
    // routes remain workerd-rendered, while prerendered pages remain static assets.
    prerenderEnvironment: 'node',
    // This site never calls astro:assets' Cloudflare Images runtime (confirmed:
    // zero usage of Astro.session or astro:assets in src/). Passthrough skips
    // provisioning the auto-detected IMAGES binding entirely -- Card M3,
    // Decision B. See PAGES-TO-WORKERS-MIGRATION-BRIEF.md.
    imageService: { build: 'compile', runtime: 'passthrough' },
  }),
  integrations: ownerAuthProofEnabled
    ? [
        authkit({
          protectedRoutes: ['/owner-proof/dashboard(.*)'],
          signInPath: '/owner-proof/login',
          loginPath: '/owner-proof/login',
          signUpPath: '/owner-proof/signup',
          callbackPath: '/owner-proof/callback',
          logoutPath: '/owner-proof/logout',
          afterSignOutUrl: '/owner-proof/signed-out',
          errorRedirect: '/owner-proof/login',
          sessionEndpoint: '/owner-proof/session',
          hydrateClient: false,
        }),
      ]
    : [],
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeAffiliateRel],
  },
  // Permanent redirects for renamed URLs. Preserves inbound links from emails,
  // social, and articles published before the slug changed.
  redirects: {
    // Only the no-trailing-slash form is declared. Astro's default
    // trailingSlash behavior ('ignore') already matches the '/...' and
    // '/.../ ' variants to the same route, so declaring both here produced
    // a duplicate-route warning ("defined in both X and X/") that a future
    // Astro version will turn into a hard build error.
    '/resources/drive-home-playbook': '/resources/what-to-say-when',
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
  vite: {
    plugins: [tailwindcss()],
    // Astro's Cloudflare adapter can initialize more than one Vite process.
    // A shared cold cache races on dependency-file replacement after lockfile
    // changes, so each process gets an isolated disposable cache directory.
    cacheDir: `/tmp/pcd-vite-verify-cache-${process.pid}`,
    build: {
      // Astro 5 inlines small bundled <script> tags by default. The site CSP only
      // allows 'self' plus explicit is:inline hashes, so an inlined bundled script
      // (e.g. the nav dropdown) has no matching hash and the browser blocks it.
      // Forcing assetsInlineLimit to 0 keeps every bundled script as an external
      // /_astro/*.js file, which 'self' covers — the Astro 4 behavior the CSP expects.
      assetsInlineLimit: 0,
    },
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
});
