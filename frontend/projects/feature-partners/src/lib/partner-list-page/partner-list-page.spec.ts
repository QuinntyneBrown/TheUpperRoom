// Traces to: 42 — Partner List Stage Filtering
// L2-021 AC (list portion): stage filter chips toggle correctly; URL params parsed
import { describe, it, expect } from 'vitest';
import { toggleStage, parseStages } from './stage-filter.utils';
import type { PartnerStage } from 'api';

describe('toggleStage', () => {
  it('adds stage when not present', () => {
    expect(toggleStage([], 'Lead')).toEqual(['Lead']);
  });

  it('removes stage when already present', () => {
    expect(toggleStage(['Lead', 'InFunnel'], 'Lead')).toEqual(['InFunnel']);
  });

  it('returns same list when adding existing stage', () => {
    const result = toggleStage(['Confirmed'], 'Confirmed');
    expect(result).toEqual([]);
  });
});

describe('parseStages', () => {
  it('returns empty array for null', () => {
    expect(parseStages(null)).toEqual([]);
  });

  it('returns single stage for single value', () => {
    expect(parseStages('Lead')).toEqual(['Lead'] as PartnerStage[]);
  });

  it('returns multiple stages for comma-separated', () => {
    expect(parseStages('Lead,InFunnel')).toEqual(['Lead', 'InFunnel'] as PartnerStage[]);
  });

  it('ignores unknown stage values', () => {
    expect(parseStages('Lead,Unknown')).toEqual(['Lead'] as PartnerStage[]);
  });
});
