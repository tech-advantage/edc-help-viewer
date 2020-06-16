import { ConfigService } from './config.service';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { mockService } from '../utils/test-helpers';

import { of } from 'rxjs';

describe('ConfigService', () => {
  let service: ConfigService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        mockService(HttpClient, ['get'])
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ConfigService);
    http = TestBed.get(HttpClient);
  });

  function getFakeConfig(httpServerValue: string | boolean): any {
    return {
      docPath: '/doc',
      stylePath: '/help/assets/style/custom.css',
      images: {
        'favicon': 'assets/images/favicon.ico',
        'logo_header': 'assets/images/logo_edc_header.png',
        'logo_info': 'assets/images/logo_edc_info.png'
      },
      useHttpdServer: httpServerValue
    };
  }

  describe('useHttpdServer', () => {
    it('should return true if http server config value is true', () => {
      spyOn(http, 'get').and.returnValue(of(getFakeConfig('true')));
      service.load(null).then(() => expect(service.useHttpdServer()).toBeTruthy());
    });
    it('should return false if http server config value is false', () => {
      spyOn(http, 'get').and.returnValue(of(new HttpResponse(
        { body: getFakeConfig('false'),
          status: null
        })));
      service.load(null).then(() => expect(service.useHttpdServer()).toBeFalsy());
    });
    it('should return true if http server config value is (boolean) true', () => {
      spyOn(http, 'get').and.returnValue(of(getFakeConfig(true)));
      service.load(null).then(() => expect(service.useHttpdServer()).toBeTruthy());
    });
    it('should return false if http server config value is (boolean) false', () => {
      spyOn(http, 'get').and.returnValue(of(getFakeConfig(false)));
      service.load(null).then(() => expect(service.useHttpdServer()).toBeFalsy());
    });
  });

});
