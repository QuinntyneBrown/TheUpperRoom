export interface CatalogEntry {
  type: string;
  label: string;
  description: string;
  icon: string;
  section: string;
  cols: number;
  rows: number;
  defaultConfig: Record<string, unknown>;
}

export const WIDGET_CATALOG: CatalogEntry[] = [
  {
    type: 'line-chart',
    label: 'Line Chart',
    description: 'Visualise a metric trend over time.',
    icon: 'show_chart',
    section: 'CHARTS',
    cols: 4,
    rows: 3,
    defaultConfig: { metric: 'contacts.created', range: '7d' },
  },
  {
    type: 'kpi',
    label: 'KPI',
    description: 'Show a single key metric at a glance.',
    icon: 'speed',
    section: 'KPI CARDS',
    cols: 2,
    rows: 2,
    defaultConfig: { metric: 'contacts.total' },
  },
];
