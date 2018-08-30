import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { arrayMove } from 'react-sortable-hoc';

import SortableContainer from './SortableContainer';
import ContentNode from './ContentNode';
import { getLogger } from './Logger';
import { TYPE_CONTENT, TYPE_COMPONENT } from './utils';

// TODO need to improve this.
export const NODE_TYPE_DEFAULT = {};
export const NODE_TYPES = {
  listUnordered: {
    symbol: '* ',
    pattern: /^\* ./,
  },
  listOrdered: {
    symbol: '* ',
    pattern: /^\d\. ./,
  },
};

export default class MDXControl extends Component {
  constructor(props) {
    super(props);

    this.logger = getLogger('MDXControl', 'orange');
    this.log = this.log.bind(this);
    const initItem = this.makeItem('');

    this.state = {
      nodeIsMarkdown: false,
      nodeType: NODE_TYPE_DEFAULT,
      items: [initItem],
      currentFocusID: initItem.id,
    };

    this.handleInput = this.handleInput.bind(this);
    this.removeContent = this.removeContent.bind(this);
    this.addItem = this.addItem.bind(this);
    this.setValue = this.setValue.bind(this);
    this.matchNode = this.matchNode.bind(this);
    this.setNodeType = this.setNodeType.bind(this);
    this.makeItem = this.makeItem.bind(this);
    this.renderContentNodes = this.renderContentNodes.bind(this);
  }

  log(...messages) {
    this.logger.log(...messages);
  }

  makeItem(value, type, id = '') {
    const i = id === '' ? uuid() : id;
    return {
      id: i,
      value,
      type: TYPE_CONTENT,
    };
  }

  handleInput(evt) {
    this.setState({
      content: evt.target.textContent,
    });
  }

  // @TODO: drag-n-drop sorting isn't working.
  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      {
        items: arrayMove(this.state.items, oldIndex, newIndex),
      },
      () => {
        // TODO: No sir, I don't like this..
        this.props.onChange(this.state.items);
      },
    );
  };

  addItem(index, type, value = '') {
    let replace = 0;
    let newValue = null;
    if (value instanceof Array) {
      newValue = value.map(chunk => this.makeItem(chunk, type));

      // If we got multiple values and the current node value is empty, use the first value for the current node.
      // If the current node value is NOT empty, the first value will be used to create a new node.
      replace = this.state.items[index].value === '' ? 1 : 0;
    } else {
      newValue = this.makeItem(value, type);
    }
    const items = [...this.state.items];
    items.splice.apply(items, [index + 1, replace].concat(newValue));
    this.setState({ items, currentFocusID: newValue.id });
  }

  removeContent(index) {
    const items = [...this.state.items];
    if (items.length <= 1) return;
    const temp = index === 0 ? 0 : index - 1;
    items.splice(index, 1);
    this.setState({ items, currentFocusID: items[temp].id });
  }

  setValue(index, value) {
    const items = [...this.state.items];
    const id = this.state.items[index].id;
    items.splice(index, 1, this.makeItem(value, TYPE_CONTENT, id));
    this.setState({ items }, () => {
      this.props.onChange(this.state.items);
    });
  }

  matchNode(value, pattern) {
    return value.match(pattern) !== null;
  }

  setNodeType(value) {
    if (this.matchNode(value, NODE_TYPES.listUnordered.pattern)) {
      this.setState({
        nodeIsMarkdown: true,
        nodeType: NODE_TYPES.listUnordered,
      });
    } else if (this.matchNode(value, NODE_TYPES.listOrdered.pattern)) {
      this.setState({
        nodeIsMarkdown: true,
        nodeType: NODE_TYPES.listOrdered,
      });
    } else {
      this.setState({
        nodeIsMarkdown: true,
        nodeType: NODE_TYPE_DEFAULT,
      });
    }
  }

  renderContentNodes() {
    return this.state.items.map((node, idx) => (
      <ContentNode
        key={node.id}
        index={idx}
        position={idx}
        node={node}
        addItem={this.addItem}
        removeContent={this.removeContent}
        currentFocusID={this.state.currentFocusID}
        setValue={this.setValue}
        setNodeType={this.setNodeType}
        isMarkdown={this.state.nodeIsMarkdown}
        nodeType={this.state.nodeType}
      />
    ));
  }

  render() {
    const { classNameWrapper } = this.props;

    return (
      <div className={classNameWrapper}>
        <SortableContainer
          renderContentNodes={this.renderContentNodes}
          onSortEnd={this.handleSortEnd}
          useDragHandle={true}
        />
      </div>
    );
  }
}

MDXControl.propTypes = {
  field: PropTypes.object.isRequired,
  classNameWrapper: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
