import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';

import SortableContainer from './SortableContainer';
import { getLogger } from './Logger';
import { MarkdownNode, MARKDOWN_TYPES } from './utils';

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
    const initItem = new MarkdownNode('', MARKDOWN_TYPES.text);

    this.state = {
      currentFocusID: initItem.id,
      items: [initItem],
    };

    this.handleInput = this.handleInput.bind(this);
    this.createNode = this.createNode.bind(this);
    this.createNodes = this.createNodes.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }

  log(...messages) {
    this.logger.log(...messages);
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

  // Add a node.
  createNode(index, node) {
    const items = [...this.state.items];
    items.splice.apply(items, [index + 1, 0].concat(node));
    this.setState({ items, currentFocusID: node.id });
  }

  // Add multiple nodes.
  createNodes(index, nodes) {

    // If we got multiple values and the current node value is empty, use the first value for the current node.
    // If the current node value is NOT empty, the first value will be used to create a new node.
    const replace = this.state.items[index].value === '' ? 1 : 0;

    const items = [...this.state.items];
    items.splice.apply(items, [index + 1, replace].concat(nodes));
    // Get the last node so that we can set the focus to it.
    // pop() mutates the array, so call slice() first to get a copy.
    const lastNode = nodes.slice().pop();
    this.setState({ items, currentFocusID: lastNode.id });
  }

  // Update the value of an existing node.
  updateNode(index, node) {
    const items = [...this.state.items];
    items.splice(index, 1, node);
    this.setState({ items }, () => {
      this.props.onChange(this.state.items);
    });
  }

  // Remove a node.
  removeNode(index) {
    const items = [...this.state.items];
    if (items.length <= 1) return;
    const temp = index === 0 ? 0 : index - 1;
    items.splice(index, 1);
    this.setState({ items, currentFocusID: items[temp].id });
  }

  render() {
    const { field, classNameWrapper } = this.props;
    const cats = field.get('categories');

    // console.log(cats.getIn('components'));
    // console.group('cats');
    // for (const cat of cats) {
    //   this.log('Category Label: ', cat.get('label'));
    //   this.log('Category Name: ', cat.get('name'));
    //   this.log('Category Components: ', cat.get('components'));
    //   console.group('components');
    //   for (const component of cat.get('components')) {
    //     if (Array.isArray(component.toJS())) {
    //       // TODO: Handle arrays...
    //       continue;
    //     }
    //     this.log('Component Label: ', component.get('label'));
    //     this.log('Component name: ', component.get('name'));
    //     console.group('fields');
    //     for (const field of component.get('fields')) {
    //       this.log('Field Label: ', field.get('label'));
    //       this.log('Field name: ', field.get('name'));
    //       this.log('Field widget: ', field.get('widget'));
    //     }
    //     console.groupEnd('fields');
    //   }
    //   console.groupEnd('components');
    // }
    // console.groupEnd('cats')

    return (
      <div className={classNameWrapper}>
        <SortableContainer
          onSortEnd={this.handleSortEnd}
          useDragHandle={true}
          currentFocusID={this.state.currentFocusID}
          nodes={this.state.items}
          createNode={this.createNode}
          createNodes={this.createNodes}
          updateNode={this.updateNode}
          removeNode={this.removeNode}
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
