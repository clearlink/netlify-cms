import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import TextareaAutosize from 'react-textarea-autosize';

import { makeItem } from './helper';
import { colorsRaw } from 'netlify-cms-ui-default';

const dummyMarkdown = `First: Paragraph synonymous with football thanks to its NFL Sunday
Ticket sports pack, the only exclusive programming deal of its kind across

> Second: block quote thing..

## Third: A heading

* Fourth: A list
* Example
* Or something`;

const StyledContent = styled(TextareaAutosize)`
  width: 100%;
  height: 22px;
  padding: .5rem;
  border: 1px solid transparent;
  font-size: 1em;
  color: inherit;

  &:focus {
    border-color: ${colorsRaw.blue};
    outline: none;
  }
`;

const KEY_CREATE_NODE = 'Enter';
const KEY_DELETE_NODE = 'Backspace';
const KEY_ARR_TEST = 'a';
const KEY_STR_TEST = 's';

class ContentBlock extends PureComponent {
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
      case KEY_ARR_TEST:
        const testArr = dummyMarkdown.split('\n\n');
        const makeArr = testArr.map(chunk => makeItem(chunk));
        console.log(makeArr);
        this.props.handleEnter(this.props.position, makeArr);
        console.log('KEY DOWN', evt.key);
        break;
      case KEY_STR_TEST:
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
    return (
      <StyledContent
        id={`block-${this.props.position}`}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onPaste={this.handlePaste}
        value={this.props.value}
        placeholder="add your text here ∩༼˵☯‿☯˵༽つ¤=[]:::::>"
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

export default ContentBlock;
