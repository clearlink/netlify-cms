import React from 'react';
import { mount } from 'enzyme';

import ContentNode from '../src/ContentNode';
import { MARKDOWN_TYPES } from '../src/utils';

describe('ContentNode', () => {
  const props = {
    position: 0,
    node: {
      id: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
      type: MARKDOWN_TYPES.text,
      value: '',
    },
    currentFocusID: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
    createNode: jest.fn(),
    createNodes: jest.fn(),
    updateNode: jest.fn(),
    removeNode: jest.fn(),
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

  // Since ContentNode handles all the Node creation now, it will pass Nodes with IDs already set to the callbacks.
  // This means that when we check the callback arguments, we won't always be able to rely on the ID.
  // Because of this, we can't always use toBeCalledWith() anymore.

  describe('handleKeyDown behavior', () => {

    describe('when the enter key is pressed', () => {

      it('should call createNode', () => {
        component.find('textarea').simulate('keyDown', {
          key: 'Enter',
        });
        expect(props.createNode).toBeCalled();
        const call = props.createNode.mock.calls[0];
        const arg1 = call[0];
        const arg2 = call[1];
        expect(arg1).toBe(component.props().position);
        expect(arg2.value).toBe('');
        expect(arg2.type).toBe(component.props().node.type);
      });

      it('should call create a new node of the same type as the current node', () => {
        const props = {
          position: 0,
          node: {
            id: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
            type: MARKDOWN_TYPES.listUnordered,
            value: '* text',
          },
          currentFocusID: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
          createNode: jest.fn(),
          createNodes: jest.fn(),
          updateNode: jest.fn(),
          removeNode: jest.fn(),
        };
        const component = mount(<ContentNode {...props} />);
        component.find('textarea').simulate('keyDown', {
          key: 'Enter',
        });
        expect(props.createNode).toBeCalled();
        // Since we are using test-specific props in this test, this will be the *first* call to props.createNode, not the second.
        const call = props.createNode.mock.calls[0];
        const arg1 = call[0];
        const arg2 = call[1];
        expect(arg1).toBe(component.props().position);
        expect(arg2.value).toBe(MARKDOWN_TYPES.listUnordered.symbol);
        expect(arg2.type).toBe(component.props().node.type);
      });
    });

    describe('when the backspace key is pressed', () => {
      it('should call removeNode', () => {
        component.find('textarea').simulate('keyDown', {
          key: 'Backspace',
        });
        expect(props.removeNode).toBeCalledWith(component.props().position);
      });
    });
  });

  describe('handleChange behavior', () => {

    it('should call updateNode on value change', () => {
      component.find('textarea').simulate('change', {
        target: {
          value: 'custom value',
        },
      });
      expect(props.updateNode).toBeCalled();
      const call = props.updateNode.mock.calls[0];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.value).toBe('custom value');
    });

    it('should change the node to an unorderedList when "* text" is entered', () => {
      const value = '* text';
      component.find('textarea').simulate('change', {
        target: {
          value: value,
        },
      });
      expect(props.updateNode).toBeCalled();
      const call = props.updateNode.mock.calls[1];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.value).toBe(value);
      expect(arg2.type).toBe(MARKDOWN_TYPES.listUnordered);
    });

    it('should change the node to an orderedList when "1. text" is entered', () => {
      const value = '1. text';
      component.find('textarea').simulate('change', {
        target: {
          value: value,
        },
      });
      expect(props.updateNode).toBeCalled();
      const call = props.updateNode.mock.calls[2];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.value).toBe(value);
      expect(arg2.type).toBe(MARKDOWN_TYPES.listOrdered);
    });

    it('should change a markdown node back to a text node when a markdown symbol is cleared', () => {
      const props = {
        position: 0,
        node: {
          id: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
          type: MARKDOWN_TYPES.listUnordered,
          value: '* text',
        },
        currentFocusID: '5d5e1030-a498-11e8-bde3-e3351b0ad71b',
        createNode: jest.fn(),
        createNodes: jest.fn(),
        updateNode: jest.fn(),
        removeNode: jest.fn(),
      };
      const component = mount(<ContentNode {...props} />);
      component.find('textarea').simulate('change', {
        target: {
          value: 'text',
        },
      });
      expect(props.updateNode).toBeCalled();
      // Since we are using test-specific props in this test, this will be the *first* call to props.updateNode, not the second.
      const call = props.updateNode.mock.calls[0];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.value).toBe('text');
      expect(arg2.type).toBe(MARKDOWN_TYPES.text);
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

    it('should call createNodes with two values when two lines of text are pasted into an empty node', () => {
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.createNodes).toBeCalled();
      const call = props.createNodes.mock.calls[0];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.length).toBe(2);
    });

    it('should call createNodes with two values when pasting two lines of text into a node that already has content', () => {
      mockedPasteEvent.target.value = 'existing node content';
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.createNodes).toBeCalled();
      const call = props.createNodes.mock.calls[1];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.length).toBe(2);
    });

    it('should create list nodes when pasting markdown list content', () => {
      mockedPasteEvent.clipboardData.getData.mockImplementation(() => {
        return '* item1\n\n* item2';
      });
      component.find('textarea').simulate('paste', mockedPasteEvent);
      expect(props.createNodes).toBeCalled();
      const call = props.createNodes.mock.calls[2];
      const arg1 = call[0];
      const arg2 = call[1];
      expect(arg1).toBe(component.props().position);
      expect(arg2.length).toBe(2);
    });
  });
});
