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

import * as d3Scale from 'd3-scale';

import { Scale } from './Scale';

import { ColorScaleModel } from './ColorScaleModel';

export class ColorScale extends Scale {
  render() {
    super.render();

    this.updateExtrapolation();
    if (this.model.domain.length > 0) {
      this.scale.domain(this.model.domain);
    }
    this.setRange();
  }

  protected createD3Scale() {
    this.scale = d3Scale.scaleLinear();
  }

  protected createEventListeners() {
    super.createEventListeners();

    this.listenTo(this.model, 'colors_changed', this.setRange);
    this.model.on('change:extrapolation', () => {
      this.updateExtrapolation();
      this.trigger('color_scale_range_changed');
    });
  }

  updateExtrapolation() {
    this.scale.clamp(this.model.get('extrapolation') === 'constant');
  }

  setRange() {
    this.scale.range(this.model.colorRange);
    this.trigger('color_scale_range_changed');
  }

  scale: d3Scale.ScaleLinear<any, string> | d3Scale.ScaleTime<any, string>;
  model: ColorScaleModel;
}

export function isColorScale(scale: Scale): scale is ColorScale {
  return scale.model.type === 'color_linear';
}
