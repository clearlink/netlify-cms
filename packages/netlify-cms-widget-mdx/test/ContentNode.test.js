import React from 'react';
import { mount } from 'enzyme';
import ContentNode from 'netlify-cms-widget-mdx/src/ContentNode';

describe('ContentNode', () => {
  const props = {
    addContent: jest.fn(),
    handleBackspace: jest.fn(),
    setValue: jest.fn(),
    setNodeType: jest.fn(),
    value: '',
    nodeType: {},
    isMarkdown: false,
    position: 0,
    uuid: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
    currentFocusID: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
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

    it('should call addContent when the enter key is pressed', () => {
      component.find('textarea').simulate('keyDown', {
        key: 'Enter',
      });
      expect(props.addContent).toBeCalledWith(component.props().position, '');
    });

    it('should call handleBackspace when the backspace key is pressed', () => {
      component.find('textarea').simulate('keyDown', {
        key: 'Backspace',
      });
      expect(props.handleBackspace).toBeCalledWith(component.props().position);
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

    it('should call addContent with two values when two lines of text are pasted into an empty node', () => {
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.addContent).toBeCalledWith(component.props().position, ['line1', 'line2']);
    });

    it('should call addContent with two values when pasting two lines of text into a node that already has content', () => {
      mockedPasteEvent.target.value = 'existing node content';
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.addContent).toBeCalledWith(component.props().position, ['line1', 'line2']);
    });
  });
});
