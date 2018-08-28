import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer as ReactSortableContainer } from 'react-sortable-hoc';
import SortableElement from 'netlify-cms-widget-mdx/src/SortableElement';

const SortableContainer = ReactSortableContainer(
  ({
    nodes,
    addContent,
    removeContent,
    currentFocusID,
    setValue,
    setNodeType,
  }) => (
    <div>
      {nodes.map((node, idx) => (
        <SortableElement
          key={node.id}
          index={idx}
          position={idx}
          node={node}
          addContent={addContent}
          removeContent={removeContent}
          currentFocusID={currentFocusID}
          setValue={setValue}
          setNodeType={setNodeType}
        />
      ))}
    </div>
  ),
);

SortableContainer.propTypes = {
  nodes: PropTypes.array.isRequired,
  addContent: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  currentFocusID: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setNodeType: PropTypes.func.isRequired,
};

export default SortableContainer;
