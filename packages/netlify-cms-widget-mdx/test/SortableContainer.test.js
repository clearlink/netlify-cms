import React from 'react';
import { shallow } from 'enzyme';
import SortableContainer from '../src/SortableContainer';

describe('components wrapper', () => {
  it('should render without throwing an error', () => {
    const items = [
      {
        id: 'one',
        type: 'type',
        value: 'first',
      },
      {
        id: 'two',
        type: 'type',
        value: 'second',
      },
      {
        id: 'three',
        type: 'type',
        value: 'third',
      },
    ];
    const mockedHandleSortEnd = jest.fn();
    const mockedCreateNode = jest.fn();
    const mockedCreateNodes = jest.fn();
    const mockedUpdateNode = jest.fn();
    const mockedRemoveNode = jest.fn();
    const currentFocusID = '5d5e1030-a498-11e8-bde3-e3351b0ad71b';
    const wrapper = shallow(
      <SortableContainer
        onSortEnd={mockedHandleSortEnd}
        useDragHandle={true}
        currentFocusID={currentFocusID}
        nodes={items}
        createNode={mockedCreateNode}
        createNodes={mockedCreateNodes}
        updateNode={mockedUpdateNode}
        removeNode={mockedRemoveNode}
      />,
      {
        disableLifecycleMethods: true,
      },
    );
    expect(wrapper.length).toEqual(1);
  });
});
