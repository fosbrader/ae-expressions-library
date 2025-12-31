import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  const excludeId = url.searchParams.get('excludeId');
  
  if (!slug) {
    return new Response(JSON.stringify({ exists: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const expressions = await getCollection('expressions');
  const exists = expressions.some(expr => 
    expr.slug === slug && expr.data.id !== excludeId
  );
  
  return new Response(JSON.stringify({ exists, slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
