import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import { gitAutoCommit } from '../../../utils/gitAutoCommit';

const EXPRESSIONS_DIR = path.join(process.cwd(), 'src/content/expressions');

// Escape string for YAML double-quoted value
function escapeYamlString(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"')     // Escape double quotes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
    .replace(/\t/g, '\\t');   // Escape tabs
}

// Sanitize markdown notes to prevent frontmatter breakage
function sanitizeNotes(notes: string): string {
  if (!notes) return '';
  // Replace standalone --- lines with a safe alternative
  return notes.replace(/^---$/gm, '—--');
}

// Sanitize code to prevent YAML literal block issues
function sanitizeCode(code: string): string {
  if (!code) return '';
  // Replace standalone --- lines which would break YAML frontmatter
  return code.replace(/^---$/gm, '- --');
}

export const GET: APIRoute = async () => {
  const expressions = await getCollection('expressions');
  return new Response(JSON.stringify(expressions.map(e => ({
    id: e.data.id,
    slug: e.slug,
    title: e.data.title,
    description: e.data.description,
    dateAdded: e.data.dateAdded
  }))), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const validated = data.validated === true || data.validated === 'true';
    const validatedBy = data.validatedBy || (validated ? 'Validated by A.I. - GPT-5.1-Codex-Max' : 'Unvalidated');
    const addedBy = data.addedBy || 'A.I. - GPT-5.1-Codex-Max';

    // Generate unique ID
    const id = `expr-${Date.now().toString(36)}`;
    
    // Determine slug
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Check for duplicate slug
    const expressions = await getCollection('expressions');
    if (expressions.some(e => e.slug === slug)) {
      return new Response(JSON.stringify({ message: 'Slug already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Build frontmatter
    const today = new Date().toISOString().split('T')[0];
    const frontmatter = {
      id,
      title: data.title,
      description: data.description,
      dateAdded: today,
      aeVersion: data.aeVersion || '17.0+',
      expressionTypes: [data.expressionType],
      layerType: data.layerType,
      propertyType: data.propertyType,
      complexity: data.complexity,
      projects: data.projects || [],
      addedBy,
      validated,
      validatedBy,
      tags: data.tags || [],
      code: data.code,
      annotations: data.annotations || []
    };
    
    // Build MDX content with properly escaped YAML
    let mdxContent = `---
id: "${escapeYamlString(frontmatter.id)}"
title: "${escapeYamlString(frontmatter.title)}"
description: "${escapeYamlString(frontmatter.description)}"
dateAdded: "${frontmatter.dateAdded}"
aeVersion: "${escapeYamlString(frontmatter.aeVersion)}"
expressionTypes: ${JSON.stringify(frontmatter.expressionTypes)}
layerType: "${escapeYamlString(frontmatter.layerType)}"
propertyType: "${escapeYamlString(frontmatter.propertyType)}"
complexity: ${frontmatter.complexity}
projects: ${JSON.stringify(frontmatter.projects)}
addedBy: "${frontmatter.addedBy}"
validated: ${frontmatter.validated}
validatedBy: "${frontmatter.validatedBy}"
tags: ${JSON.stringify(frontmatter.tags)}
code: |
${sanitizeCode(frontmatter.code).split('\n').map(line => '  ' + line).join('\n')}
annotations:
${frontmatter.annotations.map(a => `  - lines: "${escapeYamlString(a.lines)}"
    title: "${escapeYamlString(a.title)}"
    description: "${escapeYamlString(a.description)}"`).join('\n') || '  []'}
---

${sanitizeNotes(data.notes || '')}
`;
    
    // Write file
    const filePath = path.join(EXPRESSIONS_DIR, `${slug}.mdx`);
    await fs.writeFile(filePath, mdxContent, 'utf-8');
    
    // Auto-commit and push
    const gitResult = await gitAutoCommit(`Add expression: ${data.title}`);
    
    return new Response(JSON.stringify({ 
      id, 
      slug, 
      success: true,
      gitPushed: gitResult.success,
      gitError: gitResult.error 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating expression:', error);
    return new Response(JSON.stringify({ message: 'Failed to create expression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
