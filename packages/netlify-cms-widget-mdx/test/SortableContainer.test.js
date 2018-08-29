import React from 'react';
import { shallow } from 'enzyme';
import SortableContainer from '../src/SortableContainer';

describe('components wrapper', () => {
  it('should render without throwing an error', () => {
    const items = [
      {
        id: 'one',
        value: 'first',
      },
      {
        id: 'two',
        value: 'second',
      },
      {
        id: 'three',
        value: 'third',
      },
    ];
    const mockedHandleEnter = jest.fn();
    const mockedHandleBackspace = jest.fn();
    const mockedSetValue = jest.fn();
    const mockedHandleSortEnd = jest.fn();
    const mockedSetNodeType = jest.fn();
    const mockedNodeType = {};
    const currentFocusID = '5d5e1030-a498-11e8-bde3-e3351b0ad71b';
    const wrapper = shallow(
      <SortableContainer
        nodes={items}
        onSortEnd={mockedHandleSortEnd}
        useDragHandle={true}
        addItem={mockedHandleEnter}
        removeContent={mockedHandleBackspace}
        currentFocusID={currentFocusID}
        setValue={mockedSetValue}
        setNodeType={mockedSetNodeType}
        isMarkdown={false}
        nodeType={mockedNodeType}
      />,
      {
        disableLifecycleMethods: true,
      },
    );
    expect(wrapper.length).toEqual(1);
  });
});
