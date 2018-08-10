import React from 'react';
import {mount, shallow} from 'enzyme';
// import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import ComponentPart from './ComponentPart.js';
// jest.mock('SortableElement');
// jest.mock('../ComponentPart.js', () => jest.fn())

describe('component part', () => {
  it('should render without throwing an error', () => {
    const item = {
      id: 'third',
      value: 'three',
    }
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const position = 0
    const wrapper = shallow(
      <ComponentPart
        key={item.id}
        index={position}
        value={item.value}
        position={position}
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
      />,
      {
        disableLifecycleMethods: true,
      }
    )
    expect(wrapper.length).toEqual(1)
  })
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
  //     <ComponentPart
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
})
