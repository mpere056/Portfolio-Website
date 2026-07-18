import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  FEATURE_FLAG_NAMES,
  detectPortfolioEnvironment,
  isFeatureEnabled,
  resolveFeatureFlags,
  type FeatureFlagName,
} from '@/lib/featureFlags';

describe('feature flags', () => {
  it('provides one typed registry and a dormant experience foundation flag', () => {
    expect(FEATURE_FLAG_NAMES).toContain('experienceFoundation');
    expectTypeOf<(typeof FEATURE_FLAG_NAMES)[number]>().toEqualTypeOf<FeatureFlagName>();
    expect(resolveFeatureFlags({ environment: 'preview' })).toMatchObject({
      experienceFoundation: true,
      globalAI: true,
      guidedTour: true,
      firstNote: true,
      semanticLighting: true,
      meaningfulDiscoveries: true,
      museumV2: true,
      lifeinboxExperience: true,
    });
    expect(resolveFeatureFlags({ environment: 'production' })).toMatchObject({
      experienceFoundation: true,
      globalAI: true,
      museumV2: true,
      lifeinboxExperience: true,
      dreamlifeExperience: false,
      sudokuExperience: false,
      ambientPresence: false,
    });
  });

  it('allows explicit local overrides only in development', () => {
    expect(resolveFeatureFlags({
      environment: 'development',
      localOverrides: { globalAI: false },
    }).globalAI).toBe(false);
    expect(resolveFeatureFlags({
      environment: 'preview',
      localOverrides: { globalAI: false },
    }).globalAI).toBe(true);
    expect(resolveFeatureFlags({
      environment: 'production',
      localOverrides: { globalAI: false },
    }).globalAI).toBe(true);
  });

  it('detects local, test, preview, and production environments without URL input', () => {
    expect(detectPortfolioEnvironment({ NODE_ENV: 'test' })).toBe('test');
    expect(detectPortfolioEnvironment({ VERCEL_ENV: 'preview' })).toBe('preview');
    expect(detectPortfolioEnvironment({ NODE_ENV: 'production' })).toBe('production');
    expect(detectPortfolioEnvironment({ NODE_ENV: 'development' })).toBe('development');
    expect(isFeatureEnabled('firstNote', resolveFeatureFlags({ environment: 'production' }))).toBe(true);
  });
});
