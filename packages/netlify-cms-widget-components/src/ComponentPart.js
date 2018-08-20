import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import styled, { css } from 'react-emotion';
import { Icon } from 'netlify-cms-ui-default';

import ContentBlock from './ContentBlock';
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
class ComponentPartBase extends React.Component {
  render() {
    // TODO: Kill :hover, let's use state to .. well.. set states.
    const {
      uuid,
      value,
      position,
      currentFocusID,
      addContent,
      handleBackspace,
      setValue,
      setNodeType,
      nodeIsMarkdown,
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
    return (
      <div className={style}>
        <DragHandle />
        <ContentBlock
          uuid={uuid}
          value={value}
          position={position}
          currentFocusID={currentFocusID}
          addContent={addContent}
          handleBackspace={handleBackspace}
          setValue={setValue}
          setNodeType={setNodeType}
          isMarkdown={isMarkdown}
          nodeType={nodeType}
        />
      </div>
    );
  }
}

const ComponentPart = SortableElement(ComponentPartBase, { withRef: true });

ComponentPart.propTypes = {
  addContent: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  setNodeType: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool.isRequired,
  nodeType: PropTypes.object.isRequired,
};

export default ComponentPart;
