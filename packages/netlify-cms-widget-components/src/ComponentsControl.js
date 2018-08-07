import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import styled, { css } from 'react-emotion';
import { Icon } from 'netlify-cms-ui-default'

const StyledDragHandle = styled('span')`
  margin-right: 10px;
  cursor: pointer;
`;

const StyledContent = styled('div')`
  flex: 1;
`;

const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon type="drag-handle" />
  </StyledDragHandle>
));

class ContentBlock extends Component {
  constructor(props) {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleKeyPress(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault()
      this.props.handleEnter(this.props.position)
    }
  }

  render() {
    return (
      <StyledContent
        id={`block-${this.props.position}`}
        onKeyPress={this.handleKeyPress}
        dangerouslySetInnerHTML={{__html: this.props.value}}
        contentEditable
      />
    )
  }
}

ContentBlock.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

const ComponentPart = SortableElement(({ value, handleEnter, position }) => {
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
  `
  return (
    <div className={style}>
      <DragHandle />
      <ContentBlock value={value} handleEnter={handleEnter} position={position} />
    </div>
  )
});

ComponentPart.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

const ComponentsWrapper = SortableContainer(({ items, handleEnter }) => (
  <div>
    {items.map((value, idx) => (
      <ComponentPart key={idx} index={idx} value={value} handleEnter={handleEnter} position={idx}/>
    ))}
  </div>
));

ComponentsWrapper.propTypes = {
  handleEnter: PropTypes.func.isRequired,
};

export default class ComponentsControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      items: ['1', '2', '3', '4',],
    };

    this.handleInput = this.handleInput.bind(this);
    this.addContentBlock = this.addContentBlock.bind(this);
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

  addContentBlock(index) {
    const items = [...this.state.items];
    const newIndex = index + 1
    items.splice(newIndex, 0, '');
    this.setState({ items }, () => {
      // @TODO: there's got to be a React Sortable way of selecting newly added elements...
      document.getElementById(`block-${newIndex}`).focus()
    });
  }

  render() {
    const { field } = this.props;
    const cats = field.get('categories');

    for (const cat of cats) {
      console.log(cat.get('label'));
      console.log(cat.get('name'));
      console.log(cat.get('components'));
    }

    return (
      <div className="components__container">
        <ComponentsWrapper
          items={this.state.items}
          onSortEnd={this.handleSortEnd}
          useDragHandle={true}
          handleEnter={this.addContentBlock}
        />
        <textarea value={this.state.content} />
      </div>
    );
  }
}
