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
import * as d3Array from 'd3-array';

import * as _ from 'underscore';

import { Scale } from './Scale';
import { OrdinalScaleModel } from './OrdinalScaleModel';

export class OrdinalScale extends Scale {
  render() {
    super.render();
    this.scale.domain(this.model.domain);
  }

  protected createD3Scale() {
    this.scale = d3Scale.scaleBand();
  }

  setRange(range: [number, number], padding = 0) {
    this.scale.range(range);
    this.scale.paddingInner(padding);
    this.scale.paddingOuter(padding / 2.0);
    this.offset =
      this.scale.domain().length === 0 ? 0 : this.scale.bandwidth() / 2.0;
  }

  expandDomain(oldRange: [number, number], newRange: [number, number]) {
    // If you have a current range and then a new range and want to
    // expand the domain to expand to the new range but keep it
    // consistent with the previous one, this is the function you use.

    // I am trying to expand the ordinal scale by setting an
    // appropriate value for the outer padding of the ordinal scale so
    // that the starting point of each of the bins match. once that
    // happens, the labels are placed at the center of the bins

    const unpaddedScale = this.scale.copy();
    unpaddedScale.range(oldRange).paddingInner(0).paddingOuter(0);
    const outerPadding =
      unpaddedScale.range().length > 0
        ? Math.abs((newRange[1] - oldRange[1]) / unpaddedScale.bandwidth())
        : 0;
    this.scale.range(newRange);
    this.scale.paddingInner(0.0);
    this.scale.paddingOuter(outerPadding);
  }

  invert(pixel: number) {
    // returns the element in the domain which is closest to pixel
    // value passed. If the pixel is outside the range of the scale,
    const domain = this.scale.domain();

    const pixelVals = domain.map((d) => {
      return (this.scale(d) as number) + this.scale.bandwidth() / 2;
    });
    const abs_diff = pixelVals.map((d) => {
      return Math.abs(pixel - d);
    });

    return domain[abs_diff.indexOf(d3Array.min(abs_diff) as number)];
  }

  invertRange(pixels: [number, number]) {
    //return all the indices between a range
    //pixels should be a non-decreasing two element array
    const domain = this.scale.domain();
    const pixelVals = domain.map((d) => {
      return (this.scale(d) as number) + this.scale.bandwidth() / 2;
    });
    const indices = _.range(pixelVals.length);
    const filteredInd = indices.filter((ind) => {
      return pixelVals[ind] >= pixels[0] && pixelVals[ind] <= pixels[1];
    });
    return filteredInd.map((ind) => {
      return domain[ind];
    });
  }

  scale: d3Scale.ScaleBand<any>;
  model: OrdinalScaleModel;
}

export function isOrdinalScale(scale: Scale): scale is OrdinalScale {
  return scale.model.type === 'ordinal';
}
