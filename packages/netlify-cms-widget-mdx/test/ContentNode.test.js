import React from 'react';
import { mount } from 'enzyme';

import ContentNode from '../src/ContentNode';
import { TYPE_CONTENT } from '../src/utils';

describe('ContentNode', () => {
  const mockedID = '5d5e1030-a498-11e8-bde3-e3351b0ad71b';
  const props = {
    addItem: jest.fn(),
    removeContent: jest.fn(),
    setValue: jest.fn(),
    setNodeType: jest.fn(),
    node: {
      value: '',
      id: mockedID,
    },
    nodeType: {},
    isMarkdown: false,
    position: 0,
    currentFocusID: mockedID,
  };

  const component = mount(<ContentNode {...props} />);

  afterEach(() => {
    component.setProps(props);
  });

  describe('when the component loads', () => {
    it('should render without throwing an error', () => {
      expect(component.length).toEqual(1);
    });
  });

  describe('basic event handling', () => {
    it('should call setValue on value change', () => {
      component.find('textarea').simulate('change', {
        target: {
          value: 'custom value',
        },
      });
      expect(props.setValue).toBeCalledWith(component.props().position, 'custom value');
    });

    it('should call addItem when the enter key is pressed', () => {
      component.find('textarea').simulate('keyDown', {
        key: 'Enter',
      });
      expect(props.addItem).toBeCalledWith(component.props().position, TYPE_CONTENT, '');
    });

    it('should call removeContent when the backspace key is pressed', () => {
      component.find('textarea').simulate('keyDown', {
        key: 'Backspace',
      });
      expect(props.removeContent).toBeCalledWith(component.props().position);
    });
  });

  describe('ContentNode: paste event handling', () => {
    let mockedPasteEvent;

    beforeEach(() => {
      mockedPasteEvent = {
        target: {
          value: '',
        },
        clipboardData: {
          getData: jest.fn(),
        },
      };
      mockedPasteEvent.clipboardData.getData.mockImplementation(() => {
        return 'line1\n\nline2';
      });
    });

    it('should call addItem with two values when two lines of text are pasted into an empty node', () => {
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.addItem).toBeCalledWith(component.props().position, TYPE_CONTENT, [
        'line1',
        'line2',
      ]);
    });

    it('should call addItem with two values when pasting two lines of text into a node that already has content', () => {
      mockedPasteEvent.target.value = 'existing node content';
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.addItem).toBeCalledWith(component.props().position, TYPE_CONTENT, [
        'line1',
        'line2',
      ]);
    });
  });
});
