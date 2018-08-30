import uuid from 'uuid/v4';
import validate from 'uuid-validate';

export class BaseNode {
  constructor(value, id = '') {

    // ID validation.
    if (id === '' || !validate(id, 4)) {
      this.id = uuid();
    } else {
      this.id = id;
    }

    // Value validation.
    if (typeof value === 'undefined') {
      throw 'value is required';
    } else {
      this.value = value;
    }
  }
}

export const MARKDOWN_TYPES = {
  text: {
    symbol: '',
    pattern: null,
  },
  listUnordered: {
    symbol: '* ',
    pattern: /^\* ./,
  },
  listOrdered: {
    symbol: '1. ',
    pattern: /^\d\. ./,
  },
};

const isValidMarkdownType = (type) => {
  for (const t in MARKDOWN_TYPES) {
    if (MARKDOWN_TYPES[t] === type) {
      return true;
    }
  }
  return false;
};

export class MarkdownNode extends BaseNode {
  constructor(value, type, id = '') {
    super(value, id);

    // Type validation.
    if (typeof type === 'undefined') {
      throw 'type is required';
    } else if (!isValidMarkdownType(type)) {
      throw 'invalid markdown type provided';
    } else {
      this.type = type;
    }
  }
}

// @TODO figure out what type of components we need to support.
export const COMPONENT_TYPES = {
  jumpLink: {},
};

const isValidComponentType = (type) => {
  for (const t in COMPONENT_TYPES) {
    if (COMPONENT_TYPES[t] === type) {
      return true;
    }
  }
  return false;
};

export class ComponentNode extends BaseNode {
  constructor(value, type, id = '') {
    super(value, id);

    // Type validation.
    if (typeof type === 'undefined') {
      throw 'type is required';
    } else if (!isValidComponentType(type)) {
      throw 'invalid component type provided';
    } else {
      this.type = type;
    }
  }
}
