export const pilotComponents = [
  { slug: 'button', name: 'Button', category: 'basic' },
  { slug: 'select', name: 'Select', category: 'input' },
  { slug: 'modal', name: 'Modal', category: 'feedback' },
  { slug: 'table', name: 'Table', category: 'data-display' },
  { slug: 'icon', name: 'Icon', category: 'basic' },
  { slug: 'json-viewer', name: 'JsonViewer', category: 'content' },
] as const;

export type PilotComponentSlug = (typeof pilotComponents)[number]['slug'];
