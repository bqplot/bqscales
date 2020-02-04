// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

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
