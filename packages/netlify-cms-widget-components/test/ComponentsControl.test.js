import React from 'react';
import { mount } from 'enzyme';
import ComponentsControl, { NODE_TYPES } from '../src/ComponentsControl.js';

describe('ComponentsControl', () => {
  const props = {
    field: { get: jest.fn(), },
    classNameWrapper: '',
  };
  const componentsControl = mount(<ComponentsControl {...props} />);
  const initialState = {
    nodeIsMarkdown: false,
    nodeType: {},
    currentFocusID: null,
    items: [{ id: '5d5e1030-a498-11e8-bde3-e3351b0ad71b', value: '' }],
  };

  describe('when the component loads', () => {
    it('should render without throwing an error', () => {
      // ? use snapshot to test proper render?
      expect(componentsControl.length).toEqual(1);
    });

    it('should default to a non-markdown node', () => {
      expect(componentsControl.state().nodeIsMarkdown).toEqual(false);
    });
  })
  
  describe('when a content node is focused and the user presses enter', () => {
    beforeEach(() => {
      componentsControl.instance().addContent(0);
    });

    afterEach(() => {
      componentsControl.setState(initialState);
    });

    it('creates a new `item` in state', () => {
      expect(componentsControl.state().items.length).toEqual(2);
    });
  });

  describe('when the user types into a content node', () => {
    describe('and the user wants to create a bullet list', () => {
      beforeEach(() => {
        componentsControl.find('textarea').simulate('change', {
          target: {
            value: '* text',
          },
        });
      });
  
      afterEach(() => {
        componentsControl.setState(initialState);
      });

      it('should change to a markdown node if markdown is entered', () => {
        expect(componentsControl.state().nodeIsMarkdown).toEqual(true);
      });

      it('should be an Unordered List if `* text` is entered', () => {
        expect(componentsControl.state().nodeType).toEqual(NODE_TYPES.listUnordered);
      });
    });

    describe('and the user wants to create a numbered list', () => {
      beforeEach(() => {
        componentsControl.find('textarea').simulate('change', {
          target: {
            value: '1. text',
          },
        });
      });
  
      afterEach(() => {
        componentsControl.setState(initialState);
      });

      it('should be an Ordered List if `1. text` is entered', () => {
        expect(componentsControl.state().nodeType).toEqual(NODE_TYPES.listOrdered);
      });
    });
  });
});

