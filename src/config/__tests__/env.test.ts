const VARIABLES = ['EXPO_PUBLIC_APP_VARIANT', 'EXPO_PUBLIC_API_URL'] as const;

const loadEnv = (values: Partial<Record<(typeof VARIABLES)[number], string>>) => {
  const saved = VARIABLES.map((name) => [name, process.env[name]] as const);
  VARIABLES.forEach((name) => {
    if (values[name] === undefined) delete process.env[name];
    else process.env[name] = values[name];
  });
  try {
    let env: unknown;
    jest.isolateModules(() => {
      env = require('../env').env;
    });
    return env;
  } finally {
    saved.forEach(([name, value]) => {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    });
  }
};

describe('env', () => {
  it('defaults to the develop variant', () => {
    expect(loadEnv({})).toEqual({ EXPO_PUBLIC_APP_VARIANT: 'develop' });
  });

  it('reads configured values', () => {
    expect(loadEnv({ EXPO_PUBLIC_APP_VARIANT: 'qa', EXPO_PUBLIC_API_URL: 'https://api.test.com' })).toEqual({
      EXPO_PUBLIC_APP_VARIANT: 'qa',
      EXPO_PUBLIC_API_URL: 'https://api.test.com',
    });
  });

  it('fails fast on an unknown variant', () => {
    expect(() => loadEnv({ EXPO_PUBLIC_APP_VARIANT: 'staging' })).toThrow('Invalid environment variables');
  });
});
