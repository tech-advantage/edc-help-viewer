import { EdcInfo } from './edc-info';

export enum InfoTypes {
  default = 'default',
  notFound = 'notFound',
}

enum InfoIcons {
  default = 'fa-exclamation-triangle',
  notFound = 'fa-question',
}

export function InfoPageFactory(type: string): EdcInfo {
  const iconCss: string = InfoIcons[type] || InfoIcons.default;
  return {
    title: `info.${type}.title`,
    subtitle: `info.${type}.subtitle`,
    iconCss: iconCss,
  };
}
