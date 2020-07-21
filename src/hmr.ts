import { ApplicationRef, NgModuleRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';
import Module = WebAssembly.Module;

export const hmrBootstrap = (module: Module, bootstrap: () => Promise<NgModuleRef<unknown>>): void => {
  let ngModule: NgModuleRef<unknown>;
  module['hot'].accept();
  bootstrap().then((mod) => (ngModule = mod));
  module['hot'].dispose(() => {
    const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const elements = appRef.components.map((c) => c.location.nativeElement);
    const makeVisible = createNewHosts(elements);
    ngModule.destroy();
    makeVisible();
  });
};
