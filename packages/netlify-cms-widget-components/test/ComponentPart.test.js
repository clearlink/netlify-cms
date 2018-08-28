import React from 'react';
import {mount, shallow} from 'enzyme';
import SortableElement from '../src/SortableElement.js';

describe('component part', () => {
  it('should render without throwing an error', () => {
    const item = {
      id: 'third',
      value: 'three',
    };
    const mockedHandleEnter = jest.fn();
    const mockedHandleBackspace = jest.fn();
    const mockedSetValue = jest.fn();
    const mockedSetNodeType = jest.fn();
    const mockedNodeType = {};
    const position = 0;
    const wrapper = shallow(
      <SortableElement
        key={item.id}
        index={position}
        value={item.value}
        position={position}
        addContent={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
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
  // it('should pass methods to the child content block', () => {
  //   //
  //   const item = {
  //     id: 'third',
  //     value: 'three',
  //   }
  //   const mockedHandleEnter = jest.fn()
  //   const mockedHandleBackspace = jest.fn()
  //   const mockedSetValue = jest.fn()
  //   const position = 1
  //   const component = mount(
  //     <SortableElement
  //       key={item.id}
  //       index={position}
  //       value={item.value}
  //       position={position}
  //       handleEnter={mockedHandleEnter}
  //       handleBackspace={mockedHandleBackspace}
  //       setValue={mockedSetValue}
  //     />, {disableLifecycleMethods: true}
  //   )
  //   component.find('textarea').simulate('keyDown', {
  //     key: 'Backspace',
  //   })
  //   expect(mockedHandleBackspace).toBeCalledWith(position)
  // })
});
