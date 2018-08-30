import React from 'react';
import { mount } from 'enzyme';

import MDXControl from '../src/MDXControl';

describe('MDXControl', () => {
  const props = {
    field: { get: jest.fn() },
    classNameWrapper: '',
    onChange: jest.fn(),
  };
  const component = mount(<MDXControl {...props} />);

  describe('when the component loads', () => {
    it('should render without throwing an error', () => {
      // ? use snapshot to test proper render?
      expect(component.length).toEqual(1);
    });

    it('should have one item', () => {
      expect(component.state().items.length).toEqual(1);
    });

    it('should set focus to the initial item', () => {
      const state = component.state();
      expect(state.currentFocusID).toEqual(state.items[0].id);
    });
  });
});
