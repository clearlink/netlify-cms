import React from 'react';

import { BaseNode } from '../src/models/BaseNode';
import { MarkdownNode, MARKDOWN_TYPES } from '../src/models/MarkdownNode';
import { ComponentNode, COMPONENT_TYPES } from '../src/models/ComponentNode';

describe('BaseNode Class', () => {

  describe('when the constructor is called', () => {

    it('should create a UUID if none is provided', () => {
      const node = new BaseNode('some value');
      expect(node.id.length).toEqual(36);
    });

    it('should return a new node with the provided UUID set correctly', () => {
      const id = 'b547adb0-cdf8-4348-9221-d14ae8dceb38';
      const node = new BaseNode('some value', id);
      expect(node.id).toEqual(id);
    });

    it('should create a new UUID if the provided id is not valid', () => {
      const node = new BaseNode('some value', 'not a uuid');
      expect(node.id.length).toEqual(36);
    });

    it('should return a node with the provided value set correctly', () => {
      const value = 'initial value';
      const node = new BaseNode(value);
      expect(node.value).toEqual(value);
    });

    it('should throw an error if missing required arguments', () => {
      expect(() => {
        const node = new BaseNode();
      }).toThrow();
    });
  });
});

describe('MarkdownNode Class', () => {

  describe('when the constructor is called', () => {

    it('should return a node the provided type set correctly', () => {
      const node = new MarkdownNode('initial value', MARKDOWN_TYPES.text);
      expect(node.type).toEqual(MARKDOWN_TYPES.text);
    });

    it('should throw an error if an invalid type is provided', () => {
      expect(() => {
        const node = new MarkdownNode('', 'derp');
      }).toThrow();
    });

    it('should throw an error if a type is not provided', () => {
      expect(() => {
        const node = new MarkdownNode('');
      }).toThrow();
    });
  });
});

describe('ComponentNode Class', () => {

  describe('when the constructor is called', () => {

    it('should return a node the provided type set correctly', () => {
      const node = new ComponentNode('initial value', COMPONENT_TYPES.jumpLink);
      expect(node.type).toEqual(COMPONENT_TYPES.jumpLink);
    });

    it('should throw an error if an invalid type is provided', () => {
      expect(() => {
        const node = new ComponentNode('', 'derp');
      }).toThrow();
    });

    it('should throw an error if a type is not provided', () => {
      expect(() => {
        const node = new ComponentNode('');
      }).toThrow();
    });
  });
});
