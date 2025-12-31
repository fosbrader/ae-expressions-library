export interface ChangeGroup {
  title: string;
  items: string[];
}

export interface VersionEntry {
  version: string;
  date: string;
  highlights?: string[];
  changes: ChangeGroup[];
}

const changelog: VersionEntry[] = [
  {
    version: '0.3.0',
    date: '2025-02-20',
    highlights: [
      'Introduced a dedicated changelog page with detailed version histories',
      'Added optional line wrapping controls to expression code samples'
    ],
    changes: [
      {
        title: 'Added',
        items: [
          'New changelog view accessible from the IDE status bar',
          'Toggle to wrap or preserve long lines in expression code blocks'
        ]
      },
      {
        title: 'Improved',
        items: [
          'Enhanced readability of long code snippets without forcing horizontal scrolls',
          'Updated layout metadata to better surface version information'
        ]
      }
    ]
  },
  {
    version: '0.2.2',
    date: '2025-01-18',
    highlights: ['Refined navigation experience and added more expression metadata'],
    changes: [
      {
        title: 'Added',
        items: [
          'Expanded expression catalog with additional project tags and categories',
          'Breadcrumb pathing to help trace expression origins'
        ]
      },
      {
        title: 'Fixed',
        items: ['Addressed minor styling inconsistencies in the IDE shell']
      }
    ]
  },
  {
    version: '0.2.0',
    date: '2024-12-05',
    highlights: ['Launched the AE Expressions Library experience'],
    changes: [
      {
        title: 'Added',
        items: [
          'Initial expression library with filtering by category, layer, and project',
          'Admin tooling for managing expressions, projects, and deployment metadata'
        ]
      },
      {
        title: 'Improved',
        items: ['Terminal-style shell, status bar, and explorer-inspired UI']
      }
    ]
  }
];

export default changelog;
