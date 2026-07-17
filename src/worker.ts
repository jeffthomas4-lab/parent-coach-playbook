import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import type { AdminAuthEnv } from './lib/admin-auth';
import { enforceAdministrativeRequest } from './lib/admin-runtime-gate';
import { withWorkerSecurityHeaders } from './lib/security-headers';

type AstroWorkerEnv = Parameters<typeof astroWorker.fetch>[1];
type PcdWorkerEnv = AstroWorkerEnv & AdminAuthEnv;

export async function fetchWithAdminGate(
  request: Request,
  env: PcdWorkerEnv,
  context: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const authFailure = await enforceAdministrativeRequest(request, env);
  if (authFailure) return withWorkerSecurityHeaders(authFailure, url.pathname);
  return astroWorker.fetch(request, env, context);
}

export default { fetch: fetchWithAdminGate };
