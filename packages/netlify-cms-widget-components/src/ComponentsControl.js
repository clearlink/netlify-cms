import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';

import ComponentsWrapper from './ComponentsWrapper';
import { makeItem } from './helper';

export default class ComponentsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        makeItem(''),
      ],
    };

    this.handleInput = this.handleInput.bind(this);
    this.removeContentBlock = this.removeContentBlock.bind(this);
    this.addContentBlock = this.addContentBlock.bind(this);
    this.setValue = this.setValue.bind(this);
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

  addContentBlock(index, value = makeItem('')) {
    const items = [...this.state.items];
    const newIndex = index + 1;
    console.log('CONCAT');
    console.table([newIndex, 0].concat(value));
    items.splice.apply(items, [newIndex, 0].concat(value));
    console.log('POST SPLICE ITEMS');
    console.table(items);
    this.setState({ items }, () => {
      // @TODO: there's got to be a React Sortable way of selecting newly added elements...
      document.getElementById(`block-${newIndex}`).focus();
    });
  }

  removeContentBlock(index) {
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
          handleEnter={this.addContentBlock}
          handleBackspace={this.removeContentBlock}
          setValue={this.setValue}
        />
      </div>
    );
  }
}
