import React from 'react';
import { shallow } from 'enzyme';
import SortableElement from '../src/SortableElement.js';

describe('component part', () => {
  it('should render without throwing an error', () => {
    const node = {
      id: 'third',
      type: 'type',
      value: 'three',
    };
    const currentFocusID = '5d5e1030-a498-11e8-bde3-e3351b0ad71b';
    const mockedCreateNode = jest.fn();
    const mockedCreateNodes = jest.fn();
    const mockedUpdateNode = jest.fn();
    const mockedRemoveNode = jest.fn();
    const position = 0;
    const wrapper = shallow(
      <SortableElement
        useDragHandle={true}
        key={node.id}
        index={position}
        position={position}
        currentFocusID={currentFocusID}
        node={node}
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
