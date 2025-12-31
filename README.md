# AE Expressions Library

A personal library of After Effects expressions, organized by use-case, project, and complexity. Built with Astro and styled like a code editor.

## Features

- 🎨 **IDE-style interface** — Familiar VS Code/Cursor aesthetic with sidebar, tabs, and terminal
- 🔍 **Full-text search** — Search expressions, code, descriptions, and tags (⌘K)
- 🏷️ **Smart filtering** — Filter by expression type, layer type, and complexity
- 📝 **Annotated code** — Expandable explanations for each code section
- 📁 **Project tracking** — See which expressions are used in which projects
- 🚀 **Static site** — Deploys to GitHub Pages automatically

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Adding Expressions

Create a new `.mdx` file in `src/content/expressions/`:

```mdx
---
title: "My Expression"
description: "What it does"
dateAdded: "2024-12-30"
aeVersion: "17.0+"
expressionTypes:
  - text-routing
layerType: text
propertyType: source-text
complexity: 2
projects:
  - project-id
tags:
  - tag1
  - tag2
code: |
  // Your expression code here
annotations:
  - lines: "1-3"
    title: "Section Title"
    description: "Explanation of what these lines do"
---

## Usage Notes

Additional markdown content here...
```

## Adding Projects

Edit `src/data/projects.json`:

```json
{
  "projects": [
    {
      "id": "my-project",
      "name": "My Project",
      "client": "Client Name",
      "year": 2024,
      "description": "Project description"
    }
  ]
}
```

## Categories

Expression types, layer types, and complexity levels are defined in `src/data/categories.json`.

## Deployment

The site auto-deploys to GitHub Pages on push to `main`. To set up:

1. Go to repo Settings → Pages
2. Source: GitHub Actions
3. Push to `main` branch

## Tech Stack

- [Astro](https://astro.build) — Static site generator
- [Fuse.js](https://www.fusejs.io/) — Client-side fuzzy search
- GitHub Actions — Auto-deploy to GitHub Pages
