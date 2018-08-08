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

const dummyMarkdown = `First: Paragraph synonymous with football thanks to its NFL Sunday
Ticket sports pack, the only exclusive programming deal of its kind across

> Second: block quote thing..

## Third: A heading

* Fourth: A list
* Example
* Or something`;

const StyledDragHandle = styled('span')`
  margin-right: 10px;
  cursor: pointer;
`;

const StyledContent = styled('textarea')`
  border: none;
  font-size: 1em;
  width: 100%;
  &:focus {
    box-shadow: 0 0 3px #ababab;
  }
`;

const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon type="drag-handle" />
  </StyledDragHandle>
));

const KEY_CREATE_NODE = 'Enter';
const KEY_DELETE_NODE = 'Backspace';
const ARR_TEST = 'a';
const STR_TEST = 's';

class ContentBlock extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  handleKeyDown(evt) {
    switch (evt.key) {
      case KEY_CREATE_NODE:
        evt.preventDefault();
        this.props.handleEnter(this.props.position);
        break;
      case KEY_DELETE_NODE:
        if (evt.target.value === '') {
          evt.preventDefault();
          this.props.handleBackspace(this.props.position);
        }
        break;
      case ARR_TEST:
        evt.preventDefault();
        const testArr = dummyMarkdown.split('\n\n');
        const makeArr = testArr.map(chunk => makeItem(chunk));
        console.log(makeArr);
        this.props.handleEnter(this.props.position, makeArr);
        console.log('KEY DOWN', evt.key);
        break;
      case STR_TEST:
        evt.preventDefault();
        this.props.handleEnter(this.props.position, makeItem('A String'));
        console.log('KEY DOWN', evt.key);
        break;
    }
  }

  handleChange(evt) {
    console.log('CHANGE', evt.target.value);
    this.props.setValue(this.props.position, evt.target.value);
  }

  handlePaste(evt) {
    console.log('PASTE');
    evt.stopPropagation();
    evt.target.value.split('\n').forEach((chunk, index) => {
      console.log('chunk', chunk, index);
      if (index === 0) {
        this.props.setValue(this.props.position, chunk);
        return;
      }
      console.log('new chunk', chunk, index);
      this.props.handleEnter(this.props.position + index, chunk);
    });
    return false;
  }

  render() {
    console.log('value: ', this.props.value);
    return (
      <StyledContent
        id={`block-${this.props.position}`}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onPaste={this.handlePaste}
        value={this.props.value}
        placeholder="add your text here ੧༼ ◕ ∧ ◕ ༽┌∩┐"
      />
    );
  }
}

ContentBlock.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

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

const makeItem = value => {
  return { value };
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
