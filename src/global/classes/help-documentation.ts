import { Link, Documentation } from 'edc-client-js';

export class HelpDocumentation extends Documentation {
  id: number;
  exportId: string;
  label: string;
  topics: HelpDocumentation[];
  url: string;
  content?: string;
  links: Link[];
  $matchesSearch?: boolean;
  $isParentSearch?: boolean;
  $isCollapsed?: boolean;
}
