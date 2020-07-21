import { get } from 'lodash';
import { InformationMap } from 'edc-client-js';
import { HelpDocumentation } from './help-documentation';

export class HelpInformationMap extends InformationMap {
  id: number;
  label: string;
  file: string;
  topics?: HelpDocumentation[];
  $resultsCount?: number;
  constructor(informationMap: InformationMap, langCode?: string, count = 0) {
    super();
    if (informationMap) {
      this.id = informationMap.id;
      this.file = informationMap.file;
      this.topics = HelpInformationMap.getRootContent(informationMap, langCode);
      this.label = HelpInformationMap.getLabel(informationMap, langCode);
      this.$resultsCount = count;
    }
  }

  static getRootContent(informationMap: InformationMap, langCode: string): HelpDocumentation[] {
    return get(informationMap, `[${langCode}].topics`);
  }

  static getLabel(informationMap: InformationMap, langCode: string): string {
    return get(informationMap, `[${langCode}].label`);
  }
}
