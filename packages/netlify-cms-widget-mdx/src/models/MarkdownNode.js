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

    // Auto set initial value if one was not provided.
    if (this.value === '' && this.type.symbol !== '') {
      // If the current type has has a markdown symbol, set it as the initial value.
      this.value = this.type.symbol;
    }

    this.match = this.match.bind(this);
    this.setValue = this.setValue.bind(this);
    this.clear = this.clear.bind(this);
    this.newOfType = this.newOfType.bind(this);
    this.isEmptyListItem = this.isEmptyListItem.bind(this);
  }

  match(value, pattern) {
    return value.match(pattern) !== null;
  }

  setValue(value) {
    this.value = value;
    if (this.match(this.value, MARKDOWN_TYPES.listUnordered.pattern)) {
      this.type = MARKDOWN_TYPES.listUnordered;
    } else if (this.match(this.value, MARKDOWN_TYPES.listOrdered.pattern)) {
      this.type = MARKDOWN_TYPES.listOrdered;
    } else {
      this.type = MARKDOWN_TYPES.text;
    }
    return this;
  }

  clear() {
    this.value = '';
    this.type = MARKDOWN_TYPES.text;
    return this;
  }

  newOfType() {
    return new MarkdownNode('', this.type);
  }

  isEmptyListItem() {
    const isList = this.type === MARKDOWN_TYPES.listUnordered || this.type === MARKDOWN_TYPES.listOrdered
    return isList && this.value === this.type.symbol
  }
}
