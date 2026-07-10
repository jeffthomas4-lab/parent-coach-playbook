/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type ENV = {
  DB: D1Database;
  PHOTOS: R2Bucket;
  SITE_URL: string;
  ADMIN_EMAILS: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<ENV>;

declare namespace App {
  interface Locals extends Runtime {}
}
