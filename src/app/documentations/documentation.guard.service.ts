import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Params, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentationsService } from './documentations.service';
import { Router } from '@angular/router';
import { LANG_PARAM, PLUGIN_PARAM } from 'app/context/context.constants';
import { DOC_ID_PARAM } from './documentations.constants';

export type ActivationResult = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable()
export class GuardService implements CanActivate {
  constructor(private router: Router, private docs: DocumentationsService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ActivationResult {
    const params: Params = route.params;
    const docId = Number(params[DOC_ID_PARAM]);
    const langToLoad = params[LANG_PARAM];
    const pluginId = params[PLUGIN_PARAM];

    //Parse an url to router to make a redirect
    const tree: UrlTree = this.router.parseUrl(`doc/${docId}/${langToLoad}`);
    //build an urlTree properly with params and queryparams

    tree.queryParams[PLUGIN_PARAM] = pluginId;
    return tree;
  }
}
