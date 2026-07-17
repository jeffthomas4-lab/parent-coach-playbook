import { requireAdmin, type AdminAuthEnv } from './admin-auth';

export function isAdministrativePath(pathname: string): boolean {
  return pathname === '/admin'
    || pathname.startsWith('/admin/')
    || pathname === '/api/admin'
    || pathname.startsWith('/api/admin/');
}

export async function enforceAdministrativeRequest(
  request: Request,
  env: AdminAuthEnv,
): Promise<Response | null> {
  const url = new URL(request.url);
  const localDevelopment = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!isAdministrativePath(url.pathname) || localDevelopment) return null;
  const auth = await requireAdmin(request, env);
  return auth instanceof Response ? auth : null;
}
