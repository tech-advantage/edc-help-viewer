import packageInfo from '../../package.json';

export const environment = {
  production: true,
  hmr: false,
  configFile: 'assets/config.json',
  version: packageInfo.version,
};
