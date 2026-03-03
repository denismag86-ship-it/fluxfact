/**
 * OAuth / Magic-link callback — exchanges code for session.
 * Supabase redirects here after email confirmation or OAuth.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseServer } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/login?error=missing_code');
  }

  const supabase = getSupabaseServer(request.headers.get('cookie') ?? '');
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirect('/login?error=auth_failed');
  }

  return redirect('/');
};
