import React from 'react';
import {mount, shallow} from 'enzyme';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import ComponentsControl from '../src/ComponentsControl.js';

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

describe('ComponentsControl: basic event handling', () => {
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

  it('should addContent', () => {
    expect(component.length).toEqual(1);
  });
});
