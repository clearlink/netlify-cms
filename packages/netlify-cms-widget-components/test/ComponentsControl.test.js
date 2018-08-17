import React from 'react';
import {mount, shallow} from 'enzyme';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import ComponentsControl, { NODE_TYPES } from '../src/ComponentsControl.js';

describe('ComponentsControl: props', () => {
  it('should render without throwing an error', () => {
    const mockField = {
      get: jest.fn(),
    };
    const wrapper = shallow(
      <ComponentsControl
        field={mockField}
        classNameWrapper=""
      />
    );
    expect(wrapper.length).toEqual(1);
  });
});

describe('ComponentsControl: markdown support', () => {
  const mockField = {
    get: jest.fn(),
  };
  let component;

  beforeEach(() => {
    component = mount(
      <ComponentsControl
        field={mockField}
        classNameWrapper=""
      />
    );
  });

  it('should default to a non-markdown node', () => {
    const state = component.state();
    expect(state.nodeIsMarkdown).toEqual(false);
  });

  it('should change to a markdown node if markdown is entered', () => {
    component.find('textarea').simulate('change', {
      target: {
        value: '* text',
      },
    });
    const state = component.state();
    expect(state.nodeIsMarkdown).toEqual(true);
  });

  it('should be an Unordered List if `* text` is entered', () => {
    component.find('textarea').simulate('change', {
      target: {
        value: '* text',
      },
    });
    const state = component.state();
    expect(state.nodeType).toEqual(NODE_TYPES.listUnordered);
  });

  it('should be an Ordered List if `1. text` is entered', () => {
    component.find('textarea').simulate('change', {
      target: {
        value: '1. text',
      },
    });
    const state = component.state();
    expect(state.nodeType).toEqual(NODE_TYPES.listOrdered);
  });
});
