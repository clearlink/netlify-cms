import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer as ReactSortableContainer } from 'react-sortable-hoc';
import SortableElement from 'netlify-cms-widget-mdx/src/SortableElement';

const SortableContainer = ReactSortableContainer(
  ({
     // onSortEnd,
     useDragHandle,
     currentFocusID,
     nodes,
     createNode,
     createNodes,
     updateNode,
     removeNode,
   }) => (
    <div>
      {nodes.map((node, idx) => (
        <SortableElement
          useDragHandle={useDragHandle}
          key={node.id}
          index={idx}
          position={idx}
          currentFocusID={currentFocusID}
          node={node}
          createNode={createNode}
          createNodes={createNodes}
          updateNode={updateNode}
          removeNode={removeNode}
        />
      ))}
    </div>
  ),
);

SortableContainer.propTypes = {
  onSortEnd: PropTypes.func.isRequired,
  useDragHandle: PropTypes.bool.isRequired,
  currentFocusID: PropTypes.string.isRequired,
  nodes: PropTypes.array.isRequired,
  createNode: PropTypes.func.isRequired,
  createNodes: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
};

export default SortableContainer;
