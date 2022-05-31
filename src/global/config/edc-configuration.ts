/**
 * Class representing the config.json object in assets folder.
 */
export class EdcConfiguration {
  docPath: string;
  documentationStylePath: string;
  themeStylePath: string;
  images: {
    logo_header: string;
    logo_info: string;
    favicon: string;
  };

  libsUrl: {
    mathjax: string;
  };

  contentSearch: {
    limitNumber: number;
    exactMatch: boolean;
    enable: boolean;
    url: string;
  };

  collapseTocAsDefault: boolean;
  displayFirstDocInsteadOfToc: boolean;
  fullHeightRightSidebarOnMobile: boolean;
}
