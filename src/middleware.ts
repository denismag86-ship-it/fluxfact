/**
 * Astro middleware — injects Supabase user into locals.
 * Gracefully skips when Supabase is not configured (static prerender).
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth when Supabase is not configured (prerender / missing env)
  if (!supabaseUrl || !supabaseKey) {
    (locals as any).user = null;
    return next();
  }

  try {
    const { getSupabaseServer } = await import('./lib/supabase');
    const cookieHeader = request.headers.get('cookie') ?? '';
    const supabase = getSupabaseServer(cookieHeader);
    const { data: { user } } = await supabase.auth.getUser();
    (locals as any).user = user;
    (locals as any).supabase = supabase;
  } catch {
    (locals as any).user = null;
  }

  return next();
});
