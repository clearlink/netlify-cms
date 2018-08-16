import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';

import ComponentsWrapper from './ComponentsWrapper';
import uuid from 'uuid/v1';

const NODE_TYPE_DEFAULT = {}
const NODE_TYPES = {
  listOrdered: {
    symbol: '* ',
    pattern: /^\* ./,
  },
  listUnordered: {
    symbol: '* ',
    pattern: /^d\. ./,
  },
};

export default class ComponentsControl extends Component {
  constructor(props) {
    super(props);

    this.debug = true;
    this.log = this.log.bind(this);

    this.state = {
      nodeIsMarkdown: false,
      nodeType: NODE_TYPE_DEFAULT,
      items: [
        this.makeItem(''),
      ],
    };

    this.handleInput = this.handleInput.bind(this);
    this.removeContent = this.removeContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.setValue = this.setValue.bind(this);
    this.matchNode = this.matchNode.bind(this);
    this.setNodeType = this.setNodeType.bind(this);
    this.makeItem = this.makeItem.bind(this);
  }

  log(caller, ...messages) {
    if (this.debug) {
      console.log('%c [ComponentsControl DEBUG]', 'color: orange', caller, ...messages);
    }
  }

  makeItem(value, id = '') {
    const i = id === '' ? uuid() : id;
    return { id: i, value };
  }

  handleInput(evt) {
    this.setState({
      content: evt.target.textContent,
    });
  }

  // @TODO: drag-n-drop sorting isn't working.
  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  addContent(index, value = '') {
    this.log('addContent', 'index, value', index, value);
    let replace = 0;
    let newValue = null;
    if (value instanceof Array) {
      newValue = value.map(chunk => this.makeItem(chunk));

      // If value is an array and current node value is empty, set the current node to the first value.
      replace = this.state.items[index].value === '' ? 1 : 0;
    } else {
      newValue = this.makeItem(value);
    }
    const items = [...this.state.items];

    this.log('addContent', 'newValue', newValue);

    const newIndex = index + 1;
    items.splice.apply(items, [index, replace].concat(newValue));
    this.setState({ items }, () => {
      this.log('addContent', 'state', this.state);
      // TODO: there's got to be a React Sortable way of selecting newly added elements...
      document.getElementById(`block-${newIndex}`).focus();
    });
  }

  removeContent(index) {
    const items = [...this.state.items];
    items.splice(index, 1);
    this.setState({ items }, () => {
      if (this.state.items.length > 1) document.getElementById(`block-${index - 1}`).focus();
    });
  }

  setValue(index, value) {
    this.log('setValue', 'index, value', index, value);
    const items = [...this.state.items];
    const id = this.state.items[index].id;
    items.splice(index, 1, this.makeItem(value, id));
    this.log('setValue', 'items', items);
    this.setState({ items }, () => {
      this.log('setValue', 'state', this.state);
    });
  }

  matchNode(value, pattern) {
    return value.match(pattern) !== null;
  }

  setNodeType(value) {
    if (this.matchNode(value, NODE_TYPES.listUnordered.pattern)) {
      console.log('unordered list node');
      this.setState({
        nodeIsMarkdown: true,
        nodeType: NODE_TYPES.listUnordered,
      });
    } else if (this.matchNode(value, NODE_TYPES.listOrdered.pattern)) {
      console.log('ordered list node');
      this.setState({
        nodeIsMarkdown: true,
        nodeType: NODE_TYPES.listOrdered,
      });
    } else {
      console.log('not a markdown node');
      this.setState({
        nodeIsMarkdown: true,
        nodeType: NODE_TYPE_DEFAULT,
      });
    }
  }

  render() {
    const { field, classNameWrapper } = this.props;
    const cats = field.get('categories');

    // for (const cat of cats) {
    //   console.log(cat.get('label'));
    //   console.log(cat.get('name'));
    //   console.log(cat.get('components'));
    // }

    return (
      <div className={classNameWrapper}>
        <ComponentsWrapper
          items={this.state.items}
          onSortEnd={this.handleSortEnd}
          useDragHandle={true}
          addContent={this.addContent}
          handleBackspace={this.removeContent}
          setValue={this.setValue}
          setNodeType={this.setNodeType}
          isMarkdown={this.state.nodeIsMarkdown}
          nodeType={this.state.nodeType}
        />
      </div>
    );
  }
}
