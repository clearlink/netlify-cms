import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import TextareaAutosize from 'react-textarea-autosize';

import { getLogger } from './Logger';
import { colorsRaw } from 'netlify-cms-ui-default';
import { MarkdownNode, MARKDOWN_TYPES } from './models/MarkdownNode';

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

        const type = this.props.node.type;
        const symbol = this.props.node.type.symbol;
        const value = evt.target.value;
        this.log(type);
        this.log(symbol);
        this.log(value);

        if (this.props.node.isEmptyListItem()) {
          this.log('empty');
          // If this is an empty list node, clear the value and change it back to text.
          const node = this.props.node.clear();
          this.props.updateNode(this.props.position, node);
        } else {
          this.log('not empty');
          // Create a new node of the same type as this one.
          // If the user has deleted an existing markdown symbol, the change handler should have already set the correct type.
          const node = this.props.node.newOfType();
          this.props.createNode(this.props.position, node);
        }

        break;
      case KEY_DELETE_NODE:
        if (evt.target.value === '') {
          evt.preventDefault();
          this.props.removeNode(this.props.position);
        }
        break;
    }
  }

  handleChange(evt) {
    // Copy the current node, but update the value and type if necessary.
    const node = this.props.node.setValue(evt.target.value);
    this.props.updateNode(this.props.position, node);
  }

  // TODO: Test evt.clipboardData in multiple browsers
  handlePaste(evt) {
    // TODO: Research if we need `window.clipboardData` for browser support

    const clipboard = evt.clipboardData.getData('Text');
    const clipboardArray = clipboard.split('\n\n');

    if (clipboardArray.length > 1) {
      evt.preventDefault();
      const nodes = clipboardArray.map((value, index) => {
        // @TODO handle other types.
        return new MarkdownNode(value, MARKDOWN_TYPES.text);
      });
      this.props.createNodes(this.props.position, nodes);
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
  node: PropTypes.instanceOf(MarkdownNode).isRequired,
  currentFocusID: PropTypes.string.isRequired,
  createNode: PropTypes.func.isRequired,
  createNodes: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
};

export default ContentNode;
