import { Injectable } from '@angular/core';
import { get, isBoolean, isNumber } from 'lodash';
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
    const value = get(this.config, 'contentSearch.enable');
    return isBoolean(value) ? value : value === 'true';
  }

  /**
   * Return exact-match value, set from json file config.json
   * Both string and boolean value types are allowed
   *
   * @return {boolean}
   */
  useExactMatch(): boolean {
    const value = get(this.config, 'contentSearch.exactMatch');
    return isBoolean(value) ? value : value === 'true';
  }

  /**
   * Return match case value, set from json file config.json
   * Both string and boolean value types are allowed
   *
   * @return {boolean}
   */
  useMatchCase(): boolean {
    const value = get(this.config, 'contentSearch.matchCase');
    return isBoolean(value) ? value : value === 'true';
  }

  /**
   * Return  value, set from json file config.json
   * Both string and boolean value types are allowed
   *
   * @return {boolean}
   */
  limitNumber(): number | null {
    const value = get(this.config, 'contentSearch.limitNumber');
    return isNumber(value) ? value : null;
  }
}
