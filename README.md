# AE Expressions Library

A personal library of After Effects expressions, organized by use-case, project, and complexity. Built with Astro and styled like VS Code.

**Live Site:** https://fosbrader.github.io/ae-expressions-library

---

## 📚 Maintaining the Library

### Quick Context

This is a **static site** built with [Astro](https://astro.build). Expressions are stored as MDX files with frontmatter metadata. The site auto-deploys to GitHub Pages on push to `main`.

### Key Files & Folders

```
src/
├── content/
│   └── expressions/          ← EXPRESSION FILES GO HERE (.mdx)
├── data/
│   ├── categories.json       ← Expression types, layer types, complexity levels
│   └── projects.json         ← Project definitions (id, name, year)
├── components/               ← Astro components (don't modify unless fixing bugs)
├── layouts/
│   └── IDELayout.astro       ← Main IDE shell layout
├── pages/                    ← Route pages
└── styles/
    └── global.css            ← All styling (VS Code dark theme)
```

### Adding a New Expression

1. Create a new `.mdx` file in `src/content/expressions/`
2. Use kebab-case for filename: `my-expression-name.mdx`
3. Copy this template:

```mdx
---
title: "Expression Title"
description: "One-line description of what it does"
dateAdded: "2024-12-30"
lastUpdated: "2024-12-30"
aeVersion: "17.0+"
expressionTypes:
  - text-routing          # Pick from categories.json → expressionTypes
layerType: text           # Pick from categories.json → layerTypes
propertyType: source-text # Pick from categories.json → propertyTypes
complexity: 2             # 1-4 (Simple, Moderate, Advanced, Expert)
projects:
  - project-id            # Must match id in projects.json
addedBy: "Brad Fosler"
validated: true
validatedBy: "Validated by Brad Fosler" # or "Unvalidated"
tags:
  - relevant
  - keywords
code: |
  // Your expression code here
  // Use | for multiline YAML strings
  var x = 1;
annotations:
  - lines: "1-2"
    title: "Section Name"
    description: "Explanation of what these lines do. Supports <code>inline code</code>."
  - lines: "3-5"
    title: "Another Section"
    description: "More explanation here."
---

## Usage Notes

Additional markdown content appears below the code block.
Use this for setup instructions, gotchas, customization tips, etc.
```

### Adding a New Project

Edit `src/data/projects.json`:

```json
{
  "projects": [
    {
      "id": "my-project",        // Used in expression frontmatter
      "name": "My Project",       // Display name
      "client": "Client Name",
      "year": 2024,
      "description": "Brief description"
    }
  ]
}
```

### Adding a New Category

Edit `src/data/categories.json`. Three category types:

- `expressionTypes` — What the expression does (text-routing, animation, etc.)
- `layerTypes` — What layer type it applies to (text, shape, etc.)
- `propertyTypes` — What property it goes on (source-text, position, etc.)

### Validation

After making changes, always run:

```bash
npm run build
```

If build succeeds, the changes are valid. Push to deploy.

Mark validated expressions by setting `validated: true` and `validatedBy: "Validated by {name}"` (for example, `"Validated by Brad Fosler"`). Leave `validated` as `false` with `validatedBy: "Unvalidated"` if it still needs review.

### Common Tasks

| Task | Command |
|------|---------|
| Add expression | Create `.mdx` in `src/content/expressions/` |
| Add project | Edit `src/data/projects.json` |
| Test locally | `npm run dev` → http://localhost:4321/ae-expressions-library |
| Build | `npm run build` |
| Deploy | `git push origin main` (auto-deploys) |

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git configured

### Local Development

```bash
# Clone the repo
git clone https://github.com/fosbrader/ae-expressions-library.git
cd ae-expressions-library

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:4321/ae-expressions-library

### Adding Expressions

1. Create a new file in `src/content/expressions/` with `.mdx` extension
2. Follow the template under "Adding a New Expression" above
3. Test locally with `npm run dev`
4. Commit and push:

```bash
git add .
git commit -m "Add: expression name"
git push
```

Site updates automatically in ~1 minute.

### Expression Frontmatter Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Display name |
| `description` | string | ✅ | One-line summary |
| `dateAdded` | string | ✅ | YYYY-MM-DD format |
| `lastUpdated` | string | ❌ | YYYY-MM-DD format |
| `aeVersion` | string | ✅ | Minimum AE version (e.g., "17.0+") |
| `expressionTypes` | string[] | ✅ | Categories from `categories.json` |
| `layerType` | string | ✅ | Layer type from `categories.json` |
| `propertyType` | string | ✅ | Property from `categories.json` |
| `complexity` | number | ✅ | 1-4 difficulty level |
| `projects` | string[] | ✅ | Project IDs from `projects.json` |
| `addedBy` | string | ✅ | Who added the expression (e.g., "Brad Fosler") |
| `validated` | boolean | ✅ | Whether the expression has been tested/verified |
| `validatedBy` | string | ✅ | "Validated by {name}" or "Unvalidated" |
| `tags` | string[] | ❌ | Searchable keywords |
| `code` | string | ✅ | The expression code |
| `annotations` | array | ✅ | Code explanations |

### Annotation Format

```yaml
annotations:
  - lines: "1-3"        # Line range (or single line "1")
    title: "Title"      # Clickable header
    description: "..."  # Supports HTML like <code>
```

---

## 🏗️ Site Architecture

### Tech Stack

- **Astro 5** — Static site generator with content collections
- **MDX** — Markdown + JSX for expression files
- **Fuse.js** — Client-side fuzzy search
- **GitHub Actions** — Auto-deploy on push

### How It Works

1. Expression `.mdx` files are parsed by Astro's content collection
2. Frontmatter is validated against schema in `src/content.config.ts`
3. Pages are statically generated at build time
4. GitHub Actions runs `npm run build` and deploys `dist/` to Pages

### URL Structure

- `/` — Home page with recent expressions
- `/all/` — All expressions with filters
- `/expressions/{id}/` — Expression detail page

### Styling

All styles are in `src/styles/global.css` using CSS custom properties. The theme mimics VS Code's Dark+ color scheme.

---

## 📝 Category Reference

### Expression Types

| ID | Label | Use for |
|----|-------|---------|
| `text-routing` | Text Routing | Pulling text from other layers/comps |
| `text-style` | Text Style | Font size, color, tracking |
| `animation` | Animation | Keyframe-based or procedural motion |
| `color` | Color | Color manipulation and theming |
| `utility` | Utility | Helper functions, reusable logic |
| `responsive` | Responsive | Comp-size aware scaling |
| `time-based` | Time-Based | Time remapping, loops, delays |
| `linking` | Linking | Connecting properties across layers |
| `random` | Random/Procedural | Noise, wiggle, randomization |
| `path` | Path/Shape | Path manipulation |

### Layer Types

| ID | Use for |
|----|---------|
| `text` | Text layers |
| `shape` | Shape layers |
| `solid` | Solid layers |
| `null` | Null objects |
| `adjustment` | Adjustment layers |
| `precomp` | Pre-compositions |
| `camera` | Cameras |
| `light` | Lights |
| `any` | Works on any layer |

### Complexity Levels

| Level | Label | Description |
|-------|-------|-------------|
| 1 | ⚡ Simple | Basic expressions, single operations |
| 2 | 🔧 Moderate | Multiple operations, some logic |
| 3 | 🧠 Advanced | Complex logic, multiple dependencies |
| 4 | 💀 Expert | Heavy computation, edge cases |

---

## 🚀 Deployment

Deployment is automatic via GitHub Actions. Every push to `main`:

1. Triggers `.github/workflows/deploy.yml`
2. Runs `npm run build`
3. Uploads `dist/` to GitHub Pages
4. Site updates in ~1 minute

### Manual Deployment

If needed, you can build locally and check the output:

```bash
npm run build
npx serve dist
```

---

## 📄 License

Personal use. Not open source.
