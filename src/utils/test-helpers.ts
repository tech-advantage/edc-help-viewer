import { forEach, assign } from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

export function mockService(provide: any, methods?: string[], subject?: string): any {
  class MockService {
  }

  forEach(methods, method => MockService.prototype[method] = () => of({}));
  if (subject) {
    MockService.prototype[subject] = new BehaviorSubject<any>(undefined);
  }
  return { provide: provide, useClass: MockService };
}

export function mockedService(provide: any, methods?: string[]): any {
  forEach(methods, method => provide.prototype[method] = () => of({}));
  return provide;
}

export function mock<T>(type: new(... args: any[]) => T, obj: any = {}): T {
  const entity: T = new type();
  assign(entity, obj);
  return entity;
}

export function mockRoute(snapshot?: any, datas?: any): any {
  return { provide: ActivatedRoute, useValue: { snapshot, data: of(datas) } };
}

export function mockPipe(pipeName: string): any {
  @Pipe({ name: pipeName })
  class MockPipe implements PipeTransform {
    transform(value: any): any {
      return value;
    }
  }

  return MockPipe;
}
