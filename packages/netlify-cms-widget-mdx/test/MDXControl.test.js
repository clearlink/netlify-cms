import React from 'react';
import { mount } from 'enzyme';

import MDXControl, { NODE_TYPES } from '../src/MDXControl';
import { TYPE_CONTENT } from '../src/utils';

describe('MDXControl', () => {
  const props = {
    field: { get: jest.fn() },
    classNameWrapper: '',
    onChange: jest.fn(),
  };
  const component = mount(<MDXControl {...props} />);

  // const initialState = {
  //   currentFocusID: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
  //   items: [{ id: '5d5e1030-a498-11e8-bde3-e3351b0ad71b', value: '' }],
  // };

  beforeAll(() => {
    // component.setState(initialState);
  });

  // Runs after every test in this file
  afterEach(() => {
    // component.setState(initialState);
  });

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

  // describe('when a content node is focused and the user presses enter', () => {
  //   beforeEach(() => {
  //     component.instance().addItem(0, TYPE_CONTENT, '');
  //   });
  //
  //   it('creates a new `item` in state', () => {
  //     expect(component.state().items.length).toEqual(2);
  //   });
  //
  //   it('creates the new `item` below the current focused `item`', () => {
  //     const firstId = initialState.items[0].id;
  //     expect(component.state().items[0].id).toEqual(firstId);
  //   });
  // });
  //
  // describe('when the user types into a content node', () => {
  //   describe('and the user wants to create a bullet list', () => {
  //     beforeEach(() => {
  //       component.find('textarea').simulate('change', {
  //         target: {
  //           value: '* text',
  //         },
  //       });
  //     });
  //
  //     // ? Can this be raised up a level, since it concerns all markdown types
  //     it('should change to a markdown node if markdown is entered', () => {
  //       expect(component.state().nodeIsMarkdown).toEqual(true);
  //     });
  //
  //     it('should be an Unordered List if `* text` is entered', () => {
  //       expect(component.state().nodeType).toEqual(NODE_TYPES.listUnordered);
  //     });
  //   });
  //
  //   describe('and the user wants to create a numbered list', () => {
  //     beforeEach(() => {
  //       component.find('textarea').simulate('change', {
  //         target: {
  //           value: '1. text',
  //         },
  //       });
  //     });
  //
  //     it('should be an Ordered List if `1. text` is entered', () => {
  //       expect(component.state().nodeType).toEqual(NODE_TYPES.listOrdered);
  //     });
  //   });
  // });
});
