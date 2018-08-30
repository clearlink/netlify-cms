import { BaseNode } from './BaseNode';

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
