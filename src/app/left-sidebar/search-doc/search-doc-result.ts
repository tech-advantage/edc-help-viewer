import { TypeDocumentation } from '../../documentations/type-documentation';

export class SearchDocResult {
  constructor(
    public id: number,
    public label: string,
    public strategyId: number,
    public strategyLabel: string,
    public languageCode: string,
    public url: string,
    public type: TypeDocumentation
  ) {}
}
