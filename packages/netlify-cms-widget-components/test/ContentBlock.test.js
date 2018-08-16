import React from 'react';
import {mount, shallow} from 'enzyme';
import ContentBlock from '../src/ContentBlock.js';

describe('content block', () => {
  it('should render without throwing an error', () => {
    const mockedAddContent = jest.fn();
    const mockedHandleBackspace = jest.fn();
    const mockedSetValue = jest.fn();
    const mockedSetNodeType = jest.fn();
    const mockedNodeType = {};
    const position = 0;
    const wrapper = shallow(
      <ContentBlock
        position={position}
        addContent={mockedAddContent}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        setNodeType={mockedSetNodeType}
        isMarkdown={false}
        nodeType={mockedNodeType}
      />
    );
    expect(wrapper.length).toEqual(1);
  });
});

describe('mounted content block', () => {
  const mockedAddContent = jest.fn();
  const mockedHandleBackspace = jest.fn();
  const mockedSetValue = jest.fn();
  const mockedSetNodeType = jest.fn();
  const mockedNodeType = {};
  let position = 0;
  let component;

  beforeEach(() => {
    position += 1;
    component = mount(
      <ContentBlock
        position={position}
        addContent={mockedAddContent}
        handleBackspace={mockedHandleBackspace}
        setValue={mockedSetValue}
        setNodeType={mockedSetNodeType}
        isMarkdown={false}
        nodeType={mockedNodeType}
      />
    );
  });

  it('should call setValue on value change', () => {
    component.find('textarea').simulate('change', {
      target: {
        value: 'custom value',
      },
    });
    expect(mockedSetValue).toBeCalledWith(position, 'custom value');
  });

  it('should call addContent when the enter key is pressed', () => {
    component.find('textarea').simulate('keyDown', {
      key: 'Enter',
    });
    expect(mockedAddContent).toBeCalledWith(position, '');
  });

  it('should call handleBackspace when the backspace key is pressed', () => {
    component.find('textarea').simulate('keyDown', {
      key: 'Backspace',
    });
    expect(mockedHandleBackspace).toBeCalledWith(position);
  });
});
