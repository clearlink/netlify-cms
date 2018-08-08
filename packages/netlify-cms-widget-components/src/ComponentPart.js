import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import styled, { css } from 'react-emotion';
import { Icon } from 'netlify-cms-ui-default';
import ContentBlock from './ContentBlock';

const StyledDragHandle = styled('span')`
  margin-right: 10px;
  cursor: pointer;
`;

const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon type="drag-handle" />
  </StyledDragHandle>
));

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

export default ComponentPart;
