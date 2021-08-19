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

import { ColorScaleModel } from './ColorScaleModel';

import { convertToDate } from './LinearScaleModel';

export class DateColorScaleModel extends ColorScaleModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'DateColorScaleModel',
      _view_name: 'DateColorScale',
      min: null,
      max: null,
      mid: null,
    };
  }

  protected minMaxChanged() {
    this.min = convertToDate(this.get('min'));
    this.max = convertToDate(this.get('max'));

    this.minFromData = this.min === null;
    this.maxFromData = this.max === null;

    this.updateDomain();
  }

  protected toDomainType(value: number): Date {
    return new Date(value);
  }

  readonly type: string = 'date_color_linear';

  protected globalMin: number | Date | null = new Date().setTime(0);
  protected globalMax: number | Date | null = new Date();
}
