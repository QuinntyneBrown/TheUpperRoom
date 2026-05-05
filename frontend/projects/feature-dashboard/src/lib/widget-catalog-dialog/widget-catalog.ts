export interface CatalogEntry {
  type: string;
  label: string;
  description: string;
  cols: number;
  rows: number;
  defaultConfig: Record<string, unknown>;
}

export const WIDGET_CATALOG: CatalogEntry[] = [
  {
    type: 'kpi',
    label: 'KPI',
    description: 'Show a single key metric at a glance.',
    cols: 2,
    rows: 2,
    defaultConfig: { metric: 'contacts.total' },
  },
  {
    type: 'line-chart',
    label: 'Line Chart',
    description: 'Visualise a metric trend over time.',
    cols: 4,
    rows: 3,
    defaultConfig: { metric: 'contactsCreatedDaily', range: '7d' },
  },
];
