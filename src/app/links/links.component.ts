import { Component, Input, OnInit } from '@angular/core';
import { Link, Linkable } from 'edc-client-js';
import { ActivatedRoute, Params } from '@angular/router';
import { KEY_PARAM, SUB_KEY_PARAM, LANG_PARAM, PLUGIN_PARAM } from '../context/context.constants';

@Component({
  selector: 'app-links',
  templateUrl: 'links.component.html',
  styleUrls: ['links.component.less'],
})
export class LinksComponent implements OnInit {
  @Input() linkable: Linkable;

  params: Params;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.params = this.route.snapshot.params;
  }

  getArticleLink(index: number): string {
    let url = `/context/`;
    if (this.params[PLUGIN_PARAM]) {
      url += `${this.params[PLUGIN_PARAM]}/`;
    } else {
      console.warn(
        `Plugin identifier not found for key [${this.params[KEY_PARAM]}] and subKey [${this.params[SUB_KEY_PARAM]}]`
      );
    }
    url += `${this.params[KEY_PARAM]}/${this.params[SUB_KEY_PARAM]}/${this.params[LANG_PARAM]}/${index}`;
    return url;
  }

  getLinkLink(link: Link): string {
    return `/doc/${link.id}`;
  }
}
