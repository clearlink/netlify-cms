import React from 'react'
import {mount, shallow} from 'enzyme'
import ContentBlock from './ContentBlock.js'

describe('content block', () => {
  it('should render without throwing an error', () => {
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const position = 0
    const wrapper = shallow(
      <ContentBlock
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        position={position}
      />
    )
    expect(wrapper.length).toEqual(1)
  })
  it('should call setValue on value change', () => {
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const position = 0
    const component = mount(
      <ContentBlock
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        position={position}
      />
    )
    component.find('textarea').simulate('change', {
      target: {
        value: 'custom value',
      },
    })
    expect(mockedSetValue).toBeCalledWith(position, 'custom value')
  })
  it('should call handleEnter when the enter key is pressed', () => {
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const position = 2
    const component = mount(
      <ContentBlock
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        position={position}
      />
    )
    component.find('textarea').simulate('keyDown', {
      key: 'Enter',
    })
    expect(mockedHandleEnter).toBeCalledWith(position)
  })
  it('should call handleBackspace when the backspace key is pressed', () => {
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const position = 1
    const component = mount(
      <ContentBlock
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        position={position}
      />
    )
    component.find('textarea').simulate('keyDown', {
      key: 'Backspace',
    })
    expect(mockedHandleBackspace).toBeCalledWith(position)
  })
})
