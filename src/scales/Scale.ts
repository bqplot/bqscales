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

import { WidgetView } from '@jupyter-widgets/base';

import { ScaleModel } from './ScaleModel';

export abstract class Scale extends WidgetView {
  render() {
    this.offset = 0;
    this.createD3Scale();
    this.createEventListeners();
  }

  protected createEventListeners() {
    this.listenTo(this.model, 'domain_changed', this.modelDomainChanged);
    this.listenTo(this.model, 'highlight_axis', this.highlightAxis);
    this.listenTo(this.model, 'unhighlight_axis', this.unhighlightAxis);
  }

  setRange(range: [number, number], padding = undefined) {
    this.scale.range(range);
  }

  /**
   * @deprecated use setRange
   */
  set_range(range: [number, number], padding = undefined) {
    this.setRange(range, padding);
  }

  computeAndSetDomain(array: any[], id: string) {
    this.model.computeAndSetDomain(array, id);
  }

  /**
   * @deprecated use computeAndSetDomain
   */
  compute_and_set_domain(array: any[], id: string) {
    this.computeAndSetDomain(array, id);
  }

  setDomain(array: any[], id: string) {
    this.model.setDomain(array, id);
  }

  /**
   * @deprecated use set_domain
   */
  set_domain(array: any[], id: string) {
    this.setDomain(array, id);
  }

  expandDomain(oldRange: [number, number], newRange: [number, number]) {
    // Base class function. No implementation.
    // Implementation is particular to the child class
    // if you have a current range and then a new range and want to
    // expand the domain to expand to the new range but keep it
    // consistent with the previous one, this is the function you use.
  }

  /**
   * @deprecated use expandDomain
   */
  expand_domain(oldRange: [number, number], newRange: [number, number]) {
    this.expandDomain(oldRange, newRange);
  }

  protected modelDomainChanged() {
    this.scale.domain(this.model.domain);
    this.trigger('domain_changed');
  }

  protected highlightAxis() {
    this.trigger('highlight_axis');
  }

  protected unhighlightAxis() {
    this.trigger('unhighlight_axis');
  }

  protected abstract createD3Scale(): any;

  offset: number;
  scale:
    | d3Scale.ScaleTime<any, any>
    | d3Scale.ScaleOrdinal<any, any>
    | d3Scale.ScaleBand<any>
    | d3Scale.ScaleLinear<any, any>
    | d3Scale.ScaleLogarithmic<any, any>;

  model: ScaleModel;
}
