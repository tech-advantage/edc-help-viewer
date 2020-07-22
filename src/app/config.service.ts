import { Injectable } from '@angular/core';
import { get, isBoolean } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { EdcConfiguration } from '../global/config/edc-configuration';

@Injectable()
export class ConfigService {
  private config: EdcConfiguration;

  constructor(private readonly http: HttpClient) {}

  load(url: string): Promise<unknown> {
    return new Promise((resolve) => {
      this.http.get(url).subscribe((config: EdcConfiguration) => {
        this.config = config;
        resolve();
      });
    });
  }

  getConfiguration(): EdcConfiguration {
    return this.config;
  }

  /**
   * Return httpdServer value, set from json file config.json
   * Both string and boolean value types are allowed
   *
   * @return {boolean}
   */
  useHttpdServer(): boolean {
    const value = get(this.config, 'useHttpdServer');
    return isBoolean(value) ? value : value === 'true';
  }
}
