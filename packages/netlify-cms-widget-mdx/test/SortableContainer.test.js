import React from 'react';
import {shallow} from 'enzyme';
import SortableContainer from 'netlify-cms-widget-mdx/src/SortableContainer';

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
    const wrapper = shallow(
      <SortableContainer
        items={items}
        onSortEnd={mockedHandleSortEnd}
        useDragHandle={true}
        addContent={mockedHandleEnter}
        removeContent={mockedHandleBackspace}
        setValue={mockedSetValue}
        setNodeType={mockedSetNodeType}
        isMarkdown={false}
        nodeType={mockedNodeType}
      />,
      {
        disableLifecycleMethods: true,
      }
    );
    expect(wrapper.length).toEqual(1);
  });
});
