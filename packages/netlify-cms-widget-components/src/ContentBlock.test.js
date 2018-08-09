import React from 'react'
import { mount, shallow } from 'enzyme'
import ContentBlock from './ContentBlock.js'

describe('content block', () => {
  it('should render without throwing an error', () => {
    const mockedHandleEnter = () => {
      console.log('mocked enter')
    }
    const mockedHandleBackspace = () => {
      console.log('mocked backspace')
    }
    const mockedSetValue = () => {
      console.log('mocked value')
    }
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
})
