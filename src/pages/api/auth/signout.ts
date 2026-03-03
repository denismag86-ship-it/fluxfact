/**
 * Sign out — clears Supabase session.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseServer } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const supabase = getSupabaseServer(request.headers.get('cookie') ?? '');
  await supabase.auth.signOut();
  return redirect('/');
};
