export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  importResume: () => [...profileKeys.all, 'importResume'] as const,
};
