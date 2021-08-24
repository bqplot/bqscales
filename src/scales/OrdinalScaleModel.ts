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

import * as _ from 'underscore';

import { ScaleModel } from './ScaleModel';

export class OrdinalScaleModel extends ScaleModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'OrdinalScaleModel',
      _view_name: 'OrdinalScale',
      domain: [],
    };
  }

  protected setListeners() {
    this.on('change:domain', this.domainChanged, this);
    this.domainChanged();
    this.on('change:reverse', this.reverseChanged, this);
    this.reverseChanged();
  }

  private domainChanged() {
    const domain = this.get('domain');
    if (domain !== null && domain.length !== 0) {
      this.minMaxFromData = false;
      this.domain = domain.map((d: any) => {
        return d;
      });
      this.trigger('domain_changed');
    } else {
      this.minMaxFromData = true;
      this.domain = [];
      this.updateDomain();
    }
  }

  private reverseChanged(model?: any) {
    const prevReverse = model === undefined ? false : model.previous('reverse');
    this.reverse = this.get('reverse');

    // the domain should be reversed only if the previous value of reverse
    // is different from the current value. During init, domain should be
    // reversed only if reverse is set to True.
    const reverse_domain = (prevReverse + this.reverse) % 2;
    if (this.domain.length > 0 && reverse_domain === 1) {
      this.domain.reverse();
      this.trigger('domain_changed', this.domain);
    }
  }

  protected updateDomain() {
    let domain: any[] = [];
    // TODO: check for hasOwnProperty
    for (const id in this.domains) {
      domain = _.union(domain, this.domains[id]);
    }
    if (
      this.domain.length !== domain.length ||
      _.intersection(this.domain, domain).length !== domain.length
    ) {
      this.domain = domain;
      this.trigger('domain_changed', domain);
    }
  }

  computeAndSetDomain(array: any[], id: string) {
    // Takes an array and calculates the domain for the particular
    // view. If you have the domain already calculated on your side,
    // call setDomain function.
    if (!this.minMaxFromData) {
      return;
    }
    if (array.length === 0) {
      this.setDomain([], id);
      return;
    }
    const domain = _.flatten(array);
    if (this.get('reverse')) {
      domain.reverse();
    }
    this.setDomain(domain, id);
  }

  typedRange(values: number[]) {
    return values;
  }

  private minMaxFromData: boolean;

  readonly type: string = 'ordinal';
}
