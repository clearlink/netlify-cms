import React from 'react'
import {mount, shallow} from 'enzyme'
import ComponentsWrapper from '../src/ComponentsWrapper.js'

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
    ]
    const mockedHandleEnter = jest.fn()
    const mockedHandleBackspace = jest.fn()
    const mockedSetValue = jest.fn()
    const mockedHandleSortEnd = jest.fn()
    const wrapper = shallow(
      <ComponentsWrapper
        items={items}
        onSortEnd={mockedHandleSortEnd}
        useDragHandle={true}
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
})
