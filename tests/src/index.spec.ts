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

import expect = require('expect.js');

import {
  // Add any needed widget imports here (or from controls)
} from '@jupyter-widgets/base';

import {
  createTestModel
} from './utils.spec';

import {
  LinearScale, LinearScaleModel
} from '../../src/';


describe('Example', () => {

  describe('ExampleModel', () => {

    it('should be createable', () => {
      const model = createTestModel(LinearScaleModel);

      expect(model).to.be.an(LinearScaleModel);
      expect(model.get('min')).to.be(null);
      expect(model.get('max')).to.be(null);
    });

    it('should be createable with some model values', () => {
      const state = { min: 1.2 };
      const model = createTestModel(LinearScaleModel, state);

      expect(model).to.be.an(LinearScaleModel);
      expect(model.get('min')).to.be(1.2);
      expect(model.get('max')).to.be(null);
    });

  });

});
