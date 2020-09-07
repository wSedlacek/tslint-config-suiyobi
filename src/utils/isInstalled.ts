export const isInstalled = (packageName: string): boolean => {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
};
