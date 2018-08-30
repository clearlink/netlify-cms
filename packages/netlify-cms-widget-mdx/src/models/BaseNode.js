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
