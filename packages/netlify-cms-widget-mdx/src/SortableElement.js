import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement as ReactSortableElement, SortableHandle } from 'react-sortable-hoc';
import styled, { css } from 'react-emotion';
import { Icon } from 'netlify-cms-ui-default';

import ContentNode from './ContentNode';
import { colorsRaw } from 'netlify-cms-ui-default';

const StyledDragHandle = styled('span')`
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  color: transparent;
  cursor: move;
`;

const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon type="drag-handle" size="small"/>
  </StyledDragHandle>
));

// Since we are using refs with this component, it cannot be a stateless functional component, or you'll get this error
// in the tests:
//  Warning: Stateless function components cannot be given refs. Attempts to access this ref will fail.
// See this issue:
//  https://github.com/clauderic/react-sortable-hoc/issues/201
class Element extends React.Component {
  // @TODO finish this.
  determineNode(type, props) {
    // return type === TYPE_CONTENT ? <ContentNode {...props} /> : <ComponentNode {...props} />;
    return <ContentNode {...props} />;
  }

  render() {
    // TODO: Kill :hover, let's use state to .. well.. set states.
    const {
      position,
      currentFocusID,
      node,
      createNode,
      createNodes,
      updateNode,
      removeNode,
    } = this.props;

    const style = css`
      position: relative;
      margin: 1px 0;

      &:hover {
        > span {
          color: ${colorsRaw.grayDark};
        }

        > textarea {
          border-color: ${colorsRaw.grayLight};
        }
      }
    `;

    const sharedProps = {
      position,
      currentFocusID,
      node,
    };

    const contentNodeProps = {
      ...sharedProps,
      createNode,
      createNodes,
      updateNode,
      removeNode,
    };

    // @TODO useDragHandle
    return (
      <div className={style}>
        <DragHandle/>
        {this.determineNode(node.type, contentNodeProps)}
      </div>
    );
  }
}

const SortableElement = ReactSortableElement(Element, { withRef: true });

Element.propTypes = {
  // useDragHandle: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired,
  currentFocusID: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  createNode: PropTypes.func.isRequired,
  createNodes: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
};

export default SortableElement;
