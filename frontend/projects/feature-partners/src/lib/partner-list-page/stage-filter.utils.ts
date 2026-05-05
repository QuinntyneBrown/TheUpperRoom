import type { PartnerStage } from 'api';

const VALID_STAGES: PartnerStage[] = ['Lead', 'InFunnel', 'Confirmed'];

export function toggleStage(stages: PartnerStage[], stage: PartnerStage): PartnerStage[] {
  return stages.includes(stage)
    ? stages.filter(s => s !== stage)
    : [...stages, stage];
}

export function parseStages(value: string | null): PartnerStage[] {
  if (!value) return [];
  return value.split(',').filter((s): s is PartnerStage => VALID_STAGES.includes(s as PartnerStage));
}
