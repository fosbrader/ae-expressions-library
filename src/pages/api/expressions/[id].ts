import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

const EXPRESSIONS_DIR = path.join(process.cwd(), 'src/content/expressions');

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const expressions = await getCollection('expressions');
  const expression = expressions.find(e => e.data.id === id);
  
  if (!expression) {
    return new Response(JSON.stringify({ message: 'Expression not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    id: expression.data.id,
    slug: expression.slug,
    ...expression.data
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const data = await request.json();
    
    const expressions = await getCollection('expressions');
    const expression = expressions.find(e => e.data.id === id);
    
    if (!expression) {
      return new Response(JSON.stringify({ message: 'Expression not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const originalSlug = expression.slug;
    const newSlug = data.slug || originalSlug;
    
    // Check for duplicate slug (if changing)
    if (newSlug !== originalSlug) {
      if (expressions.some(e => e.slug === newSlug && e.data.id !== id)) {
        return new Response(JSON.stringify({ message: 'Slug already exists' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Build frontmatter
    const today = new Date().toISOString().split('T')[0];
    const frontmatter = {
      id: expression.data.id, // Keep original ID
      title: data.title,
      description: data.description,
      dateAdded: data.dateAdded || expression.data.dateAdded,
      lastUpdated: today,
      aeVersion: data.aeVersion || '17.0+',
      expressionTypes: [data.expressionType],
      layerType: data.layerType,
      propertyType: data.propertyType,
      complexity: data.complexity,
      projects: data.projects || [],
      tags: data.tags || [],
      code: data.code,
      annotations: data.annotations || []
    };
    
    // Build MDX content
    let mdxContent = `---
id: "${frontmatter.id}"
title: "${frontmatter.title}"
description: "${frontmatter.description}"
dateAdded: "${frontmatter.dateAdded}"
lastUpdated: "${frontmatter.lastUpdated}"
aeVersion: "${frontmatter.aeVersion}"
expressionTypes: ${JSON.stringify(frontmatter.expressionTypes)}
layerType: "${frontmatter.layerType}"
propertyType: "${frontmatter.propertyType}"
complexity: ${frontmatter.complexity}
projects: ${JSON.stringify(frontmatter.projects)}
tags: ${JSON.stringify(frontmatter.tags)}
code: |
${frontmatter.code.split('\n').map(line => '  ' + line).join('\n')}
annotations:
${frontmatter.annotations.map(a => `  - lines: "${a.lines}"
    title: "${a.title}"
    description: "${a.description}"`).join('\n') || '  []'}
---

${data.notes || ''}
`;
    
    // If slug changed, delete old file
    if (newSlug !== originalSlug) {
      const oldFilePath = path.join(EXPRESSIONS_DIR, `${originalSlug}.mdx`);
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        // File might not exist
      }
    }
    
    // Write new file
    const newFilePath = path.join(EXPRESSIONS_DIR, `${newSlug}.mdx`);
    await fs.writeFile(newFilePath, mdxContent, 'utf-8');
    
    return new Response(JSON.stringify({ id, slug: newSlug, success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating expression:', error);
    return new Response(JSON.stringify({ message: 'Failed to update expression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    const expressions = await getCollection('expressions');
    const expression = expressions.find(e => e.data.id === id);
    
    if (!expression) {
      return new Response(JSON.stringify({ message: 'Expression not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const filePath = path.join(EXPRESSIONS_DIR, `${expression.slug}.mdx`);
    await fs.unlink(filePath);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting expression:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete expression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
