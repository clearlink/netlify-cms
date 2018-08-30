import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { arrayMove } from 'react-sortable-hoc';

import SortableContainer from './SortableContainer';
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
    const initComponent = this.makeItem('', TYPE_COMPONENT);

    this.state = {
      nodeIsMarkdown: false,
      nodeType: NODE_TYPE_DEFAULT,
      items: [initItem, initComponent],
      currentFocusID: initItem.id,
    };

    this.handleInput = this.handleInput.bind(this);
    this.removeContent = this.removeContent.bind(this);
    this.addItem = this.addItem.bind(this);
    this.setValue = this.setValue.bind(this);
    this.matchNode = this.matchNode.bind(this);
    this.setNodeType = this.setNodeType.bind(this);
    this.makeItem = this.makeItem.bind(this);
  }

  log(...messages) {
    this.logger.log(...messages);
  }

  makeItem(value, type = TYPE_CONTENT, id = '') {
    const i = id === '' ? uuid() : id;
    return {
      id: i,
      value,
      type,
      field: this.props.field,
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
          nodes={this.state.items}
          addItem={this.addItem}
          removeContent={this.removeContent}
          currentFocusID={this.state.currentFocusID}
          setValue={this.setValue}
          setNodeType={this.setNodeType}
          onSortEnd={this.handleSortEnd}
          useDragHandle={true}
          isMarkdown={this.state.nodeIsMarkdown}
          nodeType={this.state.nodeType}
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
