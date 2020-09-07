import { isInstalled } from './isInstalled';

type ModuleSpecific<T> = {
  common?: T;
  angular?: T;
  ngrx?: T;
  nx?: T;
  override?: T;
  prettier?: T;
  react?: T;
  rxjs?: T;
};

export const installedModules = (): ModuleSpecific<boolean> => {
  return {
    angular: isInstalled('@angular/core') && isInstalled('codelyzer'),
    ngrx: isInstalled('@ngrx/store'),
    nx: isInstalled('@nrwl/workspace'),
    override: isInstalled('tslint-override'),
    prettier: isInstalled('prettier'),
    react: isInstalled('react'),
    rxjs: isInstalled('rxjs'),
  };
};

const forInstalledModules = <T>(data: ModuleSpecific<T>) => {
  return Object.entries(installedModules())
    .filter(([_key, installed]) => installed)
    .map(([key]) => data[key as keyof typeof data]);
};

export const moduleSpecificArray = <T extends any>(array: ModuleSpecific<T[]>): T[] => {
  const optionalRules = forInstalledModules(array).reduce((prev, next) => [...prev, ...next?.filter((it) => !!it)] as T[], [] as T[]);

  return [...array.common, ...optionalRules] as T[];
};

export const moduleSpecificObject = <T extends object>(object: ModuleSpecific<T>): T => {
  const optionalRules = forInstalledModules<T>(object).reduce((prev, next) => ({ ...next, ...prev } as T), {} as T);

  return { ...object.common, ...optionalRules } as T;
};
