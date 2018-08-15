import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';

import ComponentsWrapper from './ComponentsWrapper';
import { makeItem } from './helper';

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
}

export default class ComponentsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeIsMarkdown: false,
      nodeType: NODE_TYPE_DEFAULT,
      items: [
        makeItem(''),
      ],
    };

    this.handleInput = this.handleInput.bind(this);
    this.removeContent = this.removeContent.bind(this);
    this.addContent = this.addContent.bind(this);
    this.setValue = this.setValue.bind(this);
    this.matchNode = this.matchNode.bind(this);
    this.setNodeType = this.setNodeType.bind(this);
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

  addContent(index, value = makeItem('')) {
    const items = [...this.state.items];
    const newIndex = index + 1;
    items.splice.apply(items, [newIndex, 0].concat(value));
    this.setState({ items }, () => {
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
    const items = [...this.state.items];
    const id = this.state.items[index].id;
    items.splice(index, 1, makeItem(value, id));
    this.setState({ items });
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
