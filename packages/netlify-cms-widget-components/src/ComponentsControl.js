import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import styled, { css } from 'react-emotion';
import { Icon } from 'netlify-cms-ui-default';

import { makeItem } from './helper';
import ContentBlock from './ContentBlock';

const StyledDragHandle = styled('span')`
  margin-right: 10px;
  cursor: pointer;
`;

const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon type="drag-handle" />
  </StyledDragHandle>
));

const ComponentPart = SortableElement(
  ({ value, position, handleEnter, handleBackspace, setValue }) => {
    const style = css`
      display: flex;
      width: 100%;
      padding: 0.5rem;
      margin: 0.5rem 0;
      border: 1px dashed transparent;
      &:hover {
        border-color: lightgray;
      }
      &:active {
        border-color: orange;
      }
    `;
    return (
      <div className={style}>
        <DragHandle />
        <ContentBlock
          value={value}
          position={position}
          handleEnter={handleEnter}
          handleBackspace={handleBackspace}
          setValue={setValue}
        />
      </div>
    );
  }
);

ComponentPart.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

const ComponentsWrapper = SortableContainer(
  ({ items, handleEnter, handleBackspace, setValue }) => (
    <div>
      {items.map((item, idx) => (
        <ComponentPart
          key={idx}
          index={idx}
          value={item.value}
          position={idx}
          handleEnter={handleEnter}
          handleBackspace={handleBackspace}
          setValue={setValue}
        />
      ))}
    </div>
  )
);

ComponentsWrapper.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default class ComponentsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        makeItem('first'),
        makeItem('second'),
        makeItem('3'),
        makeItem('4'),
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
      document.getElementById(`block-${index - 1}`).focus();
    });
  }

  setValue(index, value) {
    console.log('set value', value);
    const items = [...this.state.items];
    items.splice(index, 1, makeItem(value));
    this.setState({ items });
  }

  render() {
    const { field } = this.props;
    const cats = field.get('categories');

    // for (const cat of cats) {
    //   console.log(cat.get('label'));
    //   console.log(cat.get('name'));
    //   console.log(cat.get('components'));
    // }

    return (
      <div className="components__container">
        <ComponentsWrapper
          items={this.state.items}
          onSortEnd={this.handleSortEnd}
          useDragHandle={true}
          handleEnter={this.addContentBlock}
          handleBackspace={this.removeContentBlock}
          setValue={this.setValue}
        />
        <textarea value={this.state.content} />
      </div>
    );
  }
}
