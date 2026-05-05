import { GridsterConfig } from 'angular-gridster2';

export function buildGridsterOptions(onChanged: () => void): GridsterConfig {
  return {
    draggable: { enabled: true },
    resizable: { enabled: true },
    pushItems: true,
    swap: true,
    itemChangeCallback: onChanged,
    itemResizeCallback: onChanged,
  };
}
