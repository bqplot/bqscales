/* Copyright 2015 Bloomberg Finance L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WidgetModel } from '@jupyter-widgets/base';

import { MODULE_NAME, SEMVER_RANGE } from '../version';

export interface IModelOptions {
  model_id: string;
  comm?: any;
  widget_manager: any;
}

export abstract class ScaleModel extends WidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'ScaleModel',
      _view_name: 'Scale',
      _model_module: MODULE_NAME,
      _view_module: MODULE_NAME,
      _model_module_version: SEMVER_RANGE,
      _view_module_version: SEMVER_RANGE,
      reverse: false,
      allow_padding: true,
    };
  }

  initialize(attributes: Backbone.ObjectHash, options: IModelOptions) {
    super.initialize(attributes, options);

    this.domains = {};
    this.domain = [];

    this.setListeners();
  }

  setDomain(domain: any[], id: string) {
    // Call function only if you have computed the domain yourself. If
    // you want the scale to compute the domain based on the data for
    // your scale view, then call computeAndSetDomain
    this.domains[id] = domain;
    this.updateDomain();
  }

  /**
   * @deprecated use setDomain
   */
  set_domain(domain: any[], id: string) {
    this.setDomain(domain, id);
  }

  delDomain(domain: any[], id: string) {
    if (this.domains[id] !== undefined) {
      delete this.domains[id];
      this.updateDomain();
    }
  }

  /**
   * @deprecated use delDomain
   */
  del_domain(domain: any[], id: string) {
    this.delDomain(domain, id);
  }

  getDomainSliceInOrder() {
    return this.reverse ? this.domain.slice().reverse() : this.domain.slice();
  }

  /**
   * @deprecated use getDomainSliceInOrder
   */
  get_domain_slice_in_order() {
    return this.getDomainSliceInOrder();
  }

  getDateElem(param: string) {
    return this.convertToDate(this.get(param));
  }

  /**
   * @deprecated use getDateElem
   */
  get_date_elem(param: string) {
    return this.getDateElem(param);
  }

  setDateElem(param: string, value: any) {
    this.set(param, this.convertToJson(value));
  }

  /**
   * @deprecated use setDateElem
   */
  set_date_elem(param: string, value: any) {
    this.setDateElem(param, value);
  }

  convertToDate(elem: any) {
    // Function to convert the string to a date element
    if (elem === undefined || elem === null) {
      return null;
    }
    return new Date(elem);
  }

  /**
   * @deprecated use convertToDate
   */
  convert_to_date(elem: any) {
    return this.convertToDate(elem);
  }

  convertToJson(elem: any) {
    // converts the date to a json compliant format
    if (elem === undefined || elem === null) {
      return null;
    } else {
      if (elem.toJSON === undefined) {
        return elem;
      } else {
        // the format of the string to be sent across is
        // '%Y-%m-%dT%H:%M:%S.%f'
        // by default, toJSON returns '%Y-%m-%dT%H:%M:%S.%uZ'
        // %u is milliseconds. Hence adding 000 to convert it into
        // microseconds.
        return elem.toJSON().slice(0, -1) + '000';
      }
    }
  }

  /**
   * @deprecated use convertToJson
   */
  convert_to_json(elem: any) {
    return this.convertToJson(elem);
  }

  computeAndSetDomain(array: any[], id: string): void {}

  /**
   * @deprecated use computeAndSetDomain
   */
  compute_and_set_domain(array: any[], id: string) {
    this.computeAndSetDomain(array, id);
  }
  protected updateDomain(): void {}

  /**
   * @deprecated use updateDomain
   */
  update_domain() {
    this.updateDomain();
  }

  protected setListeners(): void {}

  readonly type: string;
  domain: any[];

  protected domains: any;
  protected reverse: boolean;
}
