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
    <Icon type="drag-handle" size="small" />
  </StyledDragHandle>
));

// Since we are using refs with this component, it cannot be a stateless functional component, or you'll get this error
// in the tests:
//  Warning: Stateless function components cannot be given refs. Attempts to access this ref will fail.
// See this issue:
//  https://github.com/clauderic/react-sortable-hoc/issues/201
class Element extends React.Component {
  render() {
    // TODO: Kill :hover, let's use state to .. well.. set states.
    const {
      node,
      position,
      currentFocusID,
      addContent,
      removeContent,
      setValue,
      setNodeType,
      isMarkdown,
      nodeType,
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
      node,
      position,
      currentFocusID,
      addContent,
      removeContent,
    }

    const contentNodeProps = {
      ...sharedProps,
      setValue,
      setNodeType,
      isMarkdown,
      nodeType,
    }

    return (
      <div className={style}>
        <DragHandle />
        <ContentNode {...contentNodeProps} />
      </div>
    );
  }
}

const SortableElement = ReactSortableElement(Element, { withRef: true });

SortableElement.propTypes = {
  addContent: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  setNodeType: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool.isRequired,
  nodeType: PropTypes.object.isRequired,
};

export default SortableElement;
