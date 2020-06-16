import { Article, Documentation } from 'edc-client-js';

export class Doc extends Documentation {
  articles: Article[];
  constructor(source?: Documentation) {
    super();
    if (source) {
      this.id = source.id;
      this.exportId = source.exportId;
      this.label = source.label;
      this.topics = source.topics;
      this.url = source.url;
      this.content = source.content;
      this.links = source.links;
    }
  }
}
