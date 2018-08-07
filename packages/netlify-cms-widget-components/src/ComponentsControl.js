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

const dummyMarkdown = `
DIRECTV is practically synonymous with football thanks to its NFL Sunday
Ticket sports pack, the only exclusive programming deal of its kind across
all major sports leagues in the US (sorry, MLB, NBA, MLS, and NHL
fans—football still puts more patrons on the barstools). It's the reason
more bars and restaurants display the DIRECTV channel guide, and it's not
uncommon to run across "best" recommendations from Yelp and TripAdvisor as
to which establishments in major cities have the NFL Sunday Ticket.

> block quote thing..

## A heading

Sports bars aren't the only businesses that can benefit from a DIRECTV package, however; there are plans tailored for waiting rooms, lobbies, gyms, banks, and other public settings, as well as private interoffice options for company break rooms, conference rooms, and personal offices.

* A list
* Example
* Or something

DIRECTV commercial packages offer plenty for sports fans, but when it comes to sheer volume of channel choices for people who'd rather watch something else, it can't quite match DISH in similar price ranges—which isn't necessarily a bad thing for public venues, where TVs tend to be on set-it-and-forget-it mode, showing basic staples like sports, news, and kids' shows. Few businesses will hand the remote over to a customer demanding to watch Russia Today on 280 (unless they're a generous tipper).
`;

const StyledDragHandle = styled('span')`
  margin-right: 10px;
  cursor: pointer;
`;

const StyledContent = styled('input')`
  flex: 1;
`;

const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon type="drag-handle" />
  </StyledDragHandle>
));

const KEY_CREATE_NODE = 'Enter'
const KEY_DELETE_NODE = 'Backspace'

class ContentBlock extends Component {
  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleKeyDown(evt) {
    switch (evt.key) {
      case KEY_CREATE_NODE:
        evt.preventDefault()
        evt.stopPropagation()
        this.props.handleEnter(this.props.position)
        break
      case KEY_DELETE_NODE:
        evt.stopPropagation()
        if (evt.target.textContent === '') {
          this.props.handleBackspace(this.props.position)
        }
        break
    }
    console.log('KEY DOWN', evt.key)
  }

  handleChange(evt) {
    console.log('CHANGE', evt.target.value)
    this.props.setValue(this.props.position, evt.target.value)
  }

  render() {
    return (
      <StyledContent
        id={`block-${this.props.position}`}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        value={this.props.value}
      />
    )
  }
}

ContentBlock.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

const ComponentPart = SortableElement(({ value, position, handleEnter, handleBackspace, setValue }) => {
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
      <ContentBlock
        value={value}
        position={position}
        handleEnter={handleEnter}
        handleBackspace={handleBackspace}
        setValue={setValue}
      />
    </div>
  )
});

ComponentPart.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

const ComponentsWrapper = SortableContainer(({ items, handleEnter, handleBackspace, setValue }) => (
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
));

ComponentsWrapper.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

const makeItem = (value) => {
  return { value }
}

export default class ComponentsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        makeItem('1'),
        makeItem('2'),
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

  addContentBlock(index) {
    const items = [...this.state.items];
    const newIndex = index + 1
    items.splice(newIndex, 0, makeItem(''));
    this.setState({ items }, () => {
      // @TODO: there's got to be a React Sortable way of selecting newly added elements...
      document.getElementById(`block-${newIndex}`).focus()
    });
  }

  removeContentBlock(index) {
    const items = [...this.state.items];
    items.splice(index, 1)
    this.setState({ items }, () => {
      document.getElementById(`block-${index - 1}`).focus()
    })
  }

  setValue(index, value) {
    console.log('set value', value)
    const items = [...this.state.items];
    items.splice(index, 1, makeItem(value));
    this.setState({ items });
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
          handleBackspace={this.removeContentBlock}
          setValue={this.setValue}
        />
        <textarea value={this.state.content} />
      </div>
    );
  }
}
