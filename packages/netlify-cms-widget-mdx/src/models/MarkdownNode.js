import { BaseNode } from './BaseNode';

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
