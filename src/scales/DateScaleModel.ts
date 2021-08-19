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

import { LinearScaleModel, convertToDate } from './LinearScaleModel';

export class DateScaleModel extends LinearScaleModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'DateScaleModel',
      _view_name: 'DateScale',
      min: null,
      max: null,
    };
  }

  minMaxChanged() {
    this.min = convertToDate(this.get('min'));
    this.max = convertToDate(this.get('max'));

    this.minFromData = this.min === null;
    this.maxFromData = this.max === null;

    this.updateDomain();
  }

  typedRange(values: any[]) {
    const ar: any = new Float64Array(values.map(Number));
    ar.type = 'date';
    return ar;
  }

  readonly type: string = 'date';

  protected globalMin: number | Date | null = new Date().setTime(0);
  protected globalMax: number | Date | null = new Date();
}
