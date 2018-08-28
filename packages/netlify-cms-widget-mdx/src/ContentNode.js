import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import TextareaAutosize from 'react-textarea-autosize';

import { getLogger } from './Logger';
import { colorsRaw } from 'netlify-cms-ui-default';
import { TYPE_CONTENT, TYPE_COMPONENT } from './utils';

const StyledContent = styled(TextareaAutosize)`
  width: 100%;
  height: 22px;
  padding: 0.5rem;
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

class ContentNode extends PureComponent {
  constructor(props) {
    super(props);

    this.textInput = React.createRef();
    this.logger = getLogger('ContentNode', 'yellow');
    this.log = this.log.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  componentDidMount() {
    this.focusInputIfCurrentFocus();
  }

  componentDidUpdate() {
    this.focusInputIfCurrentFocus();
  }

  focusInputIfCurrentFocus() {
    const textInput = this.textInput.current;
    if (this.props.node.id === this.props.currentFocusID) {
      if (textInput) textInput._ref.focus();
    }
  }

  log(...messages) {
    this.logger.log(...messages);
  }

  handleKeyDown(evt) {
    switch (evt.key) {
      case KEY_CREATE_NODE:
        evt.preventDefault();
        let value = '';
        if (this.props.isMarkdown) {
          value = this.props.nodeType.symbol;
          if (evt.target.value === value) {
            evt.target.value = '';
            return;
          }
        }
        this.props.addContent(this.props.position, TYPE_CONTENT, value);
        break;
      case KEY_DELETE_NODE:
        if (evt.target.value === '') {
          evt.preventDefault();
          this.props.removeContent(this.props.position);
        }
        break;
    }
  }

  handleChange(evt) {
    this.props.setNodeType(evt.target.value);
    this.props.setValue(this.props.position, evt.target.value);
  }

  // TODO: Test evt.clipboardData in multiple browsers
  handlePaste(evt) {
    // TODO: Research if we need `window.clipboardData` for browser support

    const clipboard = evt.clipboardData.getData('Text');
    const clipboardArray = clipboard.split('\n\n');

    if (clipboardArray.length > 1) {
      evt.preventDefault();
      this.props.addContent(this.props.position, TYPE_CONTENT, clipboardArray);
    }
  }

  render() {
    return (
      <StyledContent
        innerRef={this.textInput}
        id={`block-${this.props.position}`}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onPaste={this.handlePaste}
        value={this.props.node.value}
        placeholder="add your text here ∩༼˵☯‿☯˵༽つ¤=[]:::::>"
      />
    );
  }
}

ContentNode.propTypes = {
  position: PropTypes.number.isRequired,
  node: PropTypes.object.isRequired,
  addContent: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  currentFocusID: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setNodeType: PropTypes.func.isRequired,
};

export default ContentNode;
