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
import { LinearScale } from './LinearScale';
import { DateScaleModel } from './DateScaleModel';

export class DateScale extends LinearScale {
  render() {
    super.render();
    if (this.model.domain.length > 0) {
      this.scale.domain(this.model.domain);
    }
  }

  protected createD3Scale() {
    this.scale = d3Scale.scaleUtc();
  }

  scale: d3Scale.ScaleTime<Date, number>;
  model: DateScaleModel;
}

export function isDateScale(scale: Scale): scale is DateScale {
  return scale.model.type === 'date';
}
