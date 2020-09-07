import { dirname, join } from 'path';
import { isInstalled } from './isInstalled';

export const resolveRules = (path: string) => {
  const [dependencyOrWorkspace, ...subPath] = path.split('/');
  const dependency = dependencyOrWorkspace.includes('@') ? `${dependencyOrWorkspace}/${subPath.shift()}` : dependencyOrWorkspace;
  const dependencyPath = isInstalled(dependency) ? dirname(require.resolve(dependency)) : undefined;

  return dependencyPath ? join(dependencyPath, subPath?.join('/') ?? './') : undefined;
};
