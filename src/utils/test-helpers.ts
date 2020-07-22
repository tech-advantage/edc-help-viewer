import { forEach, assign } from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

export function mockService(provide: unknown, methods?: string[], subject?: string | string[]): unknown {
  class MockService {}

  forEach(methods, (method) => (MockService.prototype[method] = () => of({})));
  if (subject) {
    if (typeof subject === 'string') {
      subject = [subject];
    }
    subject.forEach((el) => (MockService.prototype[el] = new BehaviorSubject<unknown>(undefined)));
  }
  return { provide: provide, useClass: MockService };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export function mockedService(provide: any, methods?: string[]): unknown {
  forEach(methods, (method) => (provide.prototype[method] = () => of({})));
  return provide;
}

export function mock<T>(type: new (...args: unknown[]) => T, obj: unknown = {}): T {
  const entity: T = new type();
  assign(entity, obj);
  return entity;
}

export function mockRoute(snapshot?: unknown, datas?: unknown): unknown {
  return { provide: ActivatedRoute, useValue: { snapshot, data: of(datas) } };
}

export function mockPipe(pipeName: string): unknown {
  @Pipe({ name: pipeName })
  class MockPipe implements PipeTransform {
    transform(value: unknown): unknown {
      return value;
    }
  }

  return MockPipe;
}
