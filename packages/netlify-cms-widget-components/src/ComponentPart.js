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

// TODO: Kill :hover, let's use state to .. well.. set states.
const ComponentPart = SortableElement(
  ({ value, position, handleEnter, handleBackspace, setValue }) => {
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
          value={value}
          position={position}
          handleEnter={handleEnter}
          handleBackspace={handleBackspace}
          setValue={setValue}
        />
      </div>
    );
  }, {withRef: true}
);

ComponentPart.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

export default ComponentPart;
