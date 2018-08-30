import React from 'react';
import { shallow } from 'enzyme';
import SortableContainer from '../src/SortableContainer';

describe('SortableContainer', () => {
  const props = {
    renderContentNodes: jest.fn(),
    onSortEnd: jest.fn(),
    useDragHandle: true,
  };

  const component = shallow(<SortableContainer {...props} />, { disableLifecycleMethods: true });

  it('should render without throwing an error', () => {
    expect(component.length).toEqual(1);
  });
});
