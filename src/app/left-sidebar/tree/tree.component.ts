import { Component, OnInit, Input } from '@angular/core';
import { isEmpty, isUndefined } from 'lodash';
import { HelpDocumentation } from 'global/classes/help-documentation';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less'],
})
export class TreeComponent implements OnInit {
  @Input() documentations: HelpDocumentation[];
  @Input() depth: number;
  @Input() searchResultIds: number[];

  ngOnInit(): void {
    this.depth = this.depth || 0;
  }

  getPadding(doc: HelpDocumentation): string {
    let padding = this.depth * 15 + 10;
    if (!this.hasTopics(doc)) {
      padding += 20;
    }
    return `${padding}px`;
  }

  hasTopics(doc: HelpDocumentation): boolean {
    return !isEmpty(doc.topics);
  }

  toggleCollapse($event: MouseEvent, doc: HelpDocumentation): void {
    doc.$isCollapsed = !doc.$isCollapsed;
    $event.preventDefault();
    $event.stopPropagation();
  }

  isCollapsed(doc: HelpDocumentation): boolean {
    return !isUndefined(doc.$isCollapsed) ? doc.$isCollapsed : this.depth > 5;
  }

  /**
   * Defines if given documentation should be displayed
   * If the list of ids returned from search contains the doc id, it should be shown, as should all its parents too
   *
   * @param doc the documentation to check
   */
  isVisible(doc: HelpDocumentation): boolean {
    return isEmpty(this.searchResultIds) || doc.$matchesSearch || doc.$isParentSearch;
  }
}
