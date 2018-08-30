import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import styled from 'react-emotion';
import { Icon } from 'netlify-cms-ui-default';

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

export default DragHandle;
