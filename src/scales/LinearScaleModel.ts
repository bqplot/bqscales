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

import * as d3Array from 'd3-array';

import { ScaleModel } from './ScaleModel';

export function convertToDate(elem: string | undefined | null): Date | null {
  if (elem === undefined || elem === null) {
    return null;
  }

  return new Date(elem);
}

export class LinearScaleModel extends ScaleModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'LinearScaleModel',
      _view_name: 'LinearScale',
      min: null,
      max: null,
      min_range: 0.6,
      mid_range: 0.8,
    };
  }

  protected setListeners() {
    this.on('change:reverse', this.reverseChanged, this);
    this.reverseChanged(undefined, undefined, undefined);
    this.on_some_change(['min', 'max'], this.minMaxChanged, this);
    this.minMaxChanged();
    this.on_some_change(
      ['min_range', 'mid_range', 'stabilized'],
      this.updateDomain,
      this
    );
  }

  protected updateDomain() {
    const min = !this.minFromData
      ? this.min
      : d3Array.min(
          _.map(this.domains, (d: any[]) => {
            return d.length > 0 ? d[0] : this.globalMax;
          })
        );
    const max = !this.maxFromData
      ? this.max
      : d3Array.max(
          _.map(this.domains, (d: any[]) => {
            return d.length > 1 ? d[1] : this.globalMin;
          })
        );
    const mid = (min + max) * 0.5;
    const newWidth = ((max - min) * 0.5) / this.get('mid_range');
    const prevDomain = this.domain;
    const minIndex = this.reverse ? 1 : 0;
    const prevMin = prevDomain[minIndex];
    const prevMax = prevDomain[1 - minIndex];
    const prevMid = (prevMax + prevMin) * 0.5;
    const minWidth = (prevMax - prevMin) * 0.5 * this.get('min_range');

    const stabilized = this.get('stabilized');

    // If the scale is stabilized, only update if the new min/max is without
    // a certain range, else update as soon as the new min/max is different.
    const updateDomain = stabilized
      ? !(min >= prevMin) ||
        !(min <= prevMid - minWidth) ||
        !(max <= prevMax) ||
        !(max >= prevMid + minWidth)
      : min !== prevMin || max !== prevMax;

    if (updateDomain) {
      const newMin = stabilized ? mid - newWidth : min;
      const newMax = stabilized ? mid + newWidth : max;
      this.domain = this.reverse ? [newMax, newMin] : [newMin, newMax];
      this.trigger('domain_changed', this.domain);
    }
  }

  protected minMaxChanged() {
    this.min = this.get('min');
    this.max = this.get('max');
    this.minFromData = this.min === null;
    this.maxFromData = this.max === null;
    this.updateDomain();
  }

  private reverseChanged(model: any, value: any, options: any) {
    const prevReverse = model === undefined ? false : model.previous('reverse');
    this.reverse = this.get('reverse');

    // the domain should be reversed only if the previous value of reverse
    // is different from the current value. During init, domain should be
    // reversed only if reverse is set to True.
    const reverseDomain = (prevReverse + this.reverse) % 2;
    if (this.domain.length > 0 && reverseDomain === 1) {
      this.domain.reverse();
      this.trigger('domain_changed', this.domain);
    }
  }

  computeAndSetDomain(array: any[], id: string) {
    // Takes an array and calculates the domain for the particular
    // view. If you have the domain already calculated on your side,
    // call setDomain function.
    if (!array || array.length === 0) {
      this.setDomain([], id);
      return;
    }

    const data = array[0] instanceof Array ? array : [array];

    // @ts-ignore
    const min = d3Array.min(data.map((d) => d3Array.min(d)));
    // @ts-ignore
    const max = d3Array.max(data.map((d) => d3Array.max(d)));

    this.setDomain([min, max], id);
  }

  typedRange(values: any[]) {
    return new Float64Array(values.map(Number));
  }

  min: number | Date | null;
  max: number | Date | null;

  readonly type: string = 'linear';

  protected minFromData: boolean;
  protected maxFromData: boolean;

  protected globalMin: number | Date | null = Number.NEGATIVE_INFINITY;
  protected globalMax: number | Date | null = Number.POSITIVE_INFINITY;
}
