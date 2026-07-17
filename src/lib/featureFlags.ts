export const FEATURE_FLAG_NAMES = [
  'experienceFoundation',
  'firstNote',
  'guidedTour',
  'globalAI',
  'semanticLighting',
  'museumV2',
  'dreamlifeExperience',
  'lifeinboxExperience',
  'sudokuExperience',
  'memoryRoomPrototype',
  'skillEvidencePrototype',
  'ambientPresence',
] as const;

export type FeatureFlagName = (typeof FEATURE_FLAG_NAMES)[number];
export type PortfolioEnvironment = 'development' | 'preview' | 'production' | 'test';
export type FeatureFlags = Readonly<Record<FeatureFlagName, boolean>>;
export type FeatureFlagOverrides = Partial<Record<FeatureFlagName, boolean>>;

const ALL_DISABLED = Object.fromEntries(
  FEATURE_FLAG_NAMES.map(name => [name, false]),
) as Record<FeatureFlagName, boolean>;

const DEFAULTS: Readonly<Record<PortfolioEnvironment, FeatureFlags>> = {
  development: { ...ALL_DISABLED, experienceFoundation: true, firstNote: true, guidedTour: true, globalAI: true, semanticLighting: true },
  preview: { ...ALL_DISABLED, experienceFoundation: true, firstNote: true, guidedTour: true, globalAI: true, semanticLighting: true },
  production: { ...ALL_DISABLED },
  test: { ...ALL_DISABLED },
};

export function detectPortfolioEnvironment(
  env: Readonly<Record<string, string | undefined>> = process.env as Readonly<Record<string, string | undefined>>,
): PortfolioEnvironment {
  if (env.NODE_ENV === 'test') return 'test';
  if (env.VERCEL_ENV === 'preview') return 'preview';
  if (env.VERCEL_ENV === 'production' || env.NODE_ENV === 'production') return 'production';
  return 'development';
}

export function resolveFeatureFlags(options: {
  environment?: PortfolioEnvironment;
  localOverrides?: FeatureFlagOverrides;
} = {}): FeatureFlags {
  const environment = options.environment ?? detectPortfolioEnvironment();
  const defaults = DEFAULTS[environment];
  if (environment !== 'development' || !options.localOverrides) return { ...defaults };

  return FEATURE_FLAG_NAMES.reduce<FeatureFlags>((flags, name) => ({
    ...flags,
    [name]: options.localOverrides?.[name] ?? flags[name],
  }), { ...defaults });
}

export function isFeatureEnabled(
  name: FeatureFlagName,
  flags: FeatureFlags = resolveFeatureFlags(),
) {
  return flags[name];
}
