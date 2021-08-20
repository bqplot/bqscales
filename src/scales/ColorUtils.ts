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

import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

import { colorbrewer, ColorScheme } from './ColorBrewer';

const DEFAULT_SCHEME = 'RdYlGn';

// Returns the maximum number of colors available in the colorbrewer object
function getMaxIndex(colorObject: ColorScheme): number {
  const maxIndex = d3Array.max(Object.keys(colorObject).map(Number));

  if (maxIndex === undefined) {
    throw 'Unreachable';
  }

  return maxIndex;
}

export function cycleColors(colors: string[], count: number): any {
  const colorsLen = colors.length;
  if (colorsLen > count) {
    return colors.slice(0, count);
  } else {
    let returnArray: string[] = [];
    let iters = Math.floor(count / colorsLen);
    for (; iters > 0; iters--) {
      returnArray = returnArray.concat(colors);
    }
    return returnArray.concat(colors.slice(0, count % colorsLen));
  }
}

export function cycleColorsFromScheme(
  scheme: string,
  numSteps: number
): string[] {
  scheme = scheme in colorbrewer ? scheme : DEFAULT_SCHEME;
  const colorScheme = colorbrewer[scheme];

  // Indices of colorbrewer objects are strings
  let colorIndex = numSteps.toString();

  if (numSteps === 2) {
    return [colorScheme['3'][0], colorScheme['3'][2]];
  } else if (colorIndex in colorScheme) {
    return colorScheme[colorIndex] as string[];
  } else {
    colorIndex = getMaxIndex(colorScheme).toString();

    // @ts-ignore
    return cycleColors(colorScheme[colorIndex], numSteps);
  }
}

export function getLinearScale(scheme: string): any {
  scheme =
    scheme in colorbrewer && !(colorbrewer[scheme]['type'] === 'qual')
      ? scheme
      : DEFAULT_SCHEME;
  const colorSet = colorbrewer[scheme];
  const colorIndex = getMaxIndex(colorSet).toString();

  const colors = colorSet[colorIndex];

  // @ts-ignore
  const scale = d3Scale.scaleLinear().range(colors);
  return scale;
}

export function getOrdinalScale(scheme: string, numSteps: number): any {
  const scale = d3Scale.scaleOrdinal();
  scale.range(cycleColorsFromScheme(scheme, numSteps));
  return scale;
}

export function getLinearScaleRange(scheme: string): any {
  return getLinearScale(scheme).range();
}

export function getOrdinalScaleRange(scheme: string, numSteps: number): any {
  return getOrdinalScale(scheme, numSteps).range();
}
