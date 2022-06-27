import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Doc } from 'app/documentations/documentation';
import { ConfigService } from 'app/config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import { SearchDocService } from '../../left-sidebar/search-doc/search-doc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documentation-content',
  templateUrl: './documentation-content.component.html',
})
export class DocumentationContentComponent implements OnInit, OnChanges, OnDestroy {
  stylePath: SafeResourceUrl;
  imgUrl: string;
  searchValueObservable: string;
  private searchEventSubscription: Subscription;
  @Input() documentation: Doc;
  @Output() showGlossary = new EventEmitter<number>();

  @ViewChild('lightbox', { static: true }) lightbox: unknown;

  constructor(
    private readonly configService: ConfigService,
    private readonly sanitizer: DomSanitizer,
    private readonly modalService: BsModalService,
    private readonly eleRef: ElementRef,
    private searchDocService: SearchDocService
  ) {}

  ngOnInit(): void {
    this.stylePath = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configService.getConfiguration().documentationStylePath
    );
    this.searchEventSubscription = this.searchDocService.searchContentObservable.subscribe((data: string) => {
      this.searchValueObservable = data;
    });
  }

  ngOnDestroy(): void {
    this.searchEventSubscription.unsubscribe();
  }

  onImgDBClick(event: MouseEvent): void {
    this.imgUrl = (event.target as HTMLImageElement).currentSrc;
    this.modalService.show(this.lightbox, { class: 'lightbox modal-lg' });
  }

  glossaryClicked(event: number): void {
    this.showGlossary.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentation && changes.documentation.currentValue) {
      of(this.documentation)
        .pipe(delay(100))
        .subscribe(() => {
          const elements = this.eleRef.nativeElement.querySelectorAll('img');
          if (elements && elements.length) {
            elements.forEach((element) => {
              element.addEventListener('dblclick', this.onImgDBClick.bind(this));
            });
          }
        });
    }
  }
}
