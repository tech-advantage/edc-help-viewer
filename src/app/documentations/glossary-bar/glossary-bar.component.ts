import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { DocumentationsService } from '../documentations.service';
import { DocumentationTransfer, Documentation } from 'edc-client-js';
import { LeftSideBarSharedService } from 'app/left-sidebar/left-sidebar-shared.service';

@Component({
  selector: 'app-glossary-bar',
  templateUrl: 'glossary-bar.component.html',
  styleUrls: ['glossary-bar.less']
})
export class GlossaryBarComponent {
  height: number; // css height value
  headerHeight = 20; // height of the glossary bar header
  resizing = false;

  _glossaryId: number;
  glossary: Documentation;

  @Input() set glossaryId(id: number) {
    if (this.documentationsService) {
      this.initGlossary(id);
    }
  }

  @Output() showGlossary = new EventEmitter<boolean>();

  // resizing handler
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizing) {
      this.height = this.getHeight(event.clientY);
    }
  }

  // disable resizing on mouseUp event
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.resizing = false;
  }

  constructor(
    private readonly documentationsService: DocumentationsService,
    private readonly sideBarSharedService: LeftSideBarSharedService
  ) {}

  initGlossary(id: number) {
    if (id && this._glossaryId !== id) {
      this._glossaryId = id;
      this.documentationsService.getDocumentation(id)
        .subscribe((docTransfer: DocumentationTransfer) => this.glossary = docTransfer.doc);
    }
  }

  closeGlossary() {
    this.showGlossary.emit(false);
  }

  resizeGlossary(event: MouseEvent) {
    this.resizing = true;
    event.preventDefault();
    event.stopPropagation();
  }

  getHeight(pointY: number): number {
    return window.innerHeight - pointY - this.headerHeight;
  }

  isSideBarCollapsed(): boolean {
    return this.sideBarSharedService.isCollapsed();
  }

  getGlossaryContainerClasses(): string {
    return this.isSideBarCollapsed() ? 'glossary-container' : 'glossary-container  small-glossary';
  }
}
