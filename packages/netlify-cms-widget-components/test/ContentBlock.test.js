import React from 'react';
import {mount, shallow} from 'enzyme';
import ContentBlock from '../src/ContentBlock.js';

describe('ContentBlock: props', () => {
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

describe('ContentBlock: basic event handling', () => {
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

describe('ContentBlock: paste event handling', () => {
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

  it('should set the value of the current node and create a new node when two lines of text are pasted into an empty node', () => {
    const mockedEvent = {
      target: {
        value: '',
      },
      clipboardData: {
        getData: jest.fn(),
      },
    };
    mockedEvent.clipboardData.getData.mockImplementation(() => {
      return 'line1\n\nline2';
    });
    component.find('textarea').simulate('paste', mockedEvent);
    expect(mockedAddContent).toBeCalledWith(position, ['line1', 'line2']);
  });

  it('should create two new nodes when pasting two lines of text into a node that already has content', () => {
    const mockedEvent = {
      target: {
        value: 'existing node content',
      },
      clipboardData: {
        getData: jest.fn(),
      },
    };
    mockedEvent.clipboardData.getData.mockImplementation(() => {
      return 'line1\n\nline2';
    });
    component.find('textarea').simulate('paste', mockedEvent);
    expect(mockedAddContent).toBeCalledWith(position, ['line1', 'line2']);
  });
});
