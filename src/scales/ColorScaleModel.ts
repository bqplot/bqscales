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

import _ from 'underscore';

import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

import { IModelOptions } from './ScaleModel';
import { LinearScaleModel } from './LinearScaleModel';

import * as colorutils from './ColorUtils';

export type DomainType = number | Date;

export class ColorScaleModel extends LinearScaleModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'ColorScaleModel',
      _view_name: 'ColorScale',
      mid: null,
      scheme: 'RdYlGn',
      extrapolation: 'constant',
      colors: null,
    };
  }

  initialize(attributes: Backbone.ObjectHash, options: IModelOptions) {
    this.colorRange = [];

    super.initialize(attributes, options);
  }

  /**
   * @deprecated use colorRange
   */
  get color_range() {
    return this.colorRange;
  }

  protected setListeners() {
    super.setListeners();
    this.on_some_change(['colors', 'scheme'], this.colorsChanged, this);
    this.on('change:mid', this.updateDomain, this);
    this.colorsChanged();
  }

  protected updateDomain() {
    // Compute domain min and max
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
            return d.length > 0 ? d[d.length - 1] : this.globalMin;
          })
        );

    const prevMid = this.mid;
    this.mid = this.get('mid');

    // If the min/mid/max has changed, or the number of colors has changed,
    // update the domain
    const prevDomain = this.domain;
    const prevLength = prevDomain.length;
    const nColors = this.colorRange.length;

    if (
      min !== prevDomain[0] ||
      max !== prevDomain[prevLength - 1] ||
      nColors !== prevLength ||
      this.mid !== prevMid
    ) {
      this.domain = this.createDomain(min, this.mid, max, nColors);
      this.trigger('domain_changed', this.domain);
    }
  }

  private createDomain(
    min: DomainType,
    mid: DomainType | null,
    max: DomainType,
    nColors: number
  ) {
    // Domain ranges from min to max, with the same number of
    // elements as the color range
    const scale = d3Scale.scaleLinear();

    if (mid === undefined || mid === null) {
      // @ts-ignore
      scale.domain([0, nColors - 1]).range([min, max]);
    } else {
      const mid_index = (nColors - 1) / 2;
      // @ts-ignore
      scale.domain([0, mid_index, nColors - 1]).range([min, mid, max]);
    }

    const domain = [];
    for (let i = 0; i < nColors; i++) {
      const j = this.reverse ? nColors - 1 - i : i;
      domain.push(this.toDomainType(scale(j) as number));
    }
    return domain;
  }

  private colorsChanged() {
    const colors = this.get('colors');
    this.colorRange =
      colors.length > 0
        ? colors
        : colorutils.getLinearScaleRange(this.get('scheme'));
    // If the number of colors has changed, the domain must be updated
    this.updateDomain();
    // Update the range of the views. For a color scale the range doesn't depend
    // on the view, so ideally we could get rid of this
    this.trigger('colors_changed');
  }

  protected toDomainType(value: number): any {
    return value;
  }

  readonly type: string = 'color_linear';

  colorRange: number[];
  mid: DomainType | null = null;
}
