import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import TextareaAutosize from 'react-textarea-autosize';

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

class ContentBlock extends PureComponent {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  handleKeyDown(evt) {
    console.log('KEY ', evt.key)
    switch (evt.key) {
      case KEY_CREATE_NODE:
        evt.preventDefault();
        let value = '';
        console.log('is markdown', this.props.isMarkdown);
        if (this.props.isMarkdown) {
          value = this.props.nodeType.symbol;
          console.log('node type', this.props.nodeType);
          console.log('value', value);
          if (evt.target.value === value) {
            console.log('clear value');
            evt.target.value = '';
            return
          }
        }
        this.props.addContent(this.props.position, value);
        break;
      case KEY_DELETE_NODE:
        if (evt.target.value === '') {
          evt.preventDefault();
          this.props.handleBackspace(this.props.position);
        }
        break;
    }
  }

  handleChange(evt) {
    console.log('handleChange', evt);
    this.props.setNodeType(evt.target.value);
    this.props.setValue(this.props.position, evt.target.value);
  }

  // TODO: Test evt.clipboardData in multiple browsers
  handlePaste(evt) {
    // TODO: Research if we need `window.clipboardData` for browser support
    console.log('PASTE', evt.clipboardData || window.clipboardData);
    console.log('getClipboard', evt.clipboardData.getData('Text'));

    const clipboard = evt.clipboardData.getData('Text');
    const clipboardArray = clipboard.split('\n\n');

    if (clipboardArray.length > 1) {
      evt.preventDefault();
      this.props.addContent(this.props.position, clipboardArray);
    }
  }

  render() {
    console.log(this.props.position + 'Content Rendered')
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
  isMarkdown: PropTypes.bool.isRequired,
  addContent: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setNodeType: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  nodeType: PropTypes.object.isRequired,
};

export default ContentBlock;
