import React from 'react'
import {mount, shallow} from 'enzyme'
import ContentBlock from './ContentBlock.js'

describe('content block', () => {
  it('should render without throwing an error', () => {
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const wrapper = shallow(
      <ContentBlock
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        position={0}
      />
    )
    expect(wrapper.length).toEqual(1)
  })
  it('should call setValue on value change', () => {
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const component = mount(
      <ContentBlock
        handleEnter={mockedHandleEnter}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        position={0}
      />
    )
    component.find('textarea').simulate('change', {
      target: {
        value: 'custom value',
      },
    })
    expect(mockedSetValue).toBeCalledWith(0, 'custom value')
  })
})
