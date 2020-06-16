import { EdcInfo } from './edc-info';

export enum InfoTypes {
  default = <any>'default',
  notFound = <any>'notFound'
}

enum InfoIcons {
  default = <any>'fa-exclamation-triangle',
  notFound = <any>' fa-question',
}

export function InfoPageFactory(type: string): EdcInfo {
  const iconCss: string = InfoIcons[type] || InfoIcons['default'];
  return {
    title: `info.${type}.title`,
    subtitle: `info.${type}.subtitle`,
    iconCss: iconCss
  };
}
