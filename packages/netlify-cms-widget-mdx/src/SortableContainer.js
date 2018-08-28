import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer as ReactSortableContainer } from 'react-sortable-hoc';
import SortableElement from 'netlify-cms-widget-mdx/src/SortableElement';

const SortableContainer = ReactSortableContainer(
  ({
    items,
    currentFocusID,
    addContent,
    removeContent,
    setValue,
    setNodeType,
    isMarkdown,
    nodeType,
  }) => (
    <div>
      {items.map((item, idx) => (
        <SortableElement
          key={item.id}
          index={idx}
          position={idx}
          node={item}
          currentFocusID={currentFocusID}
          addContent={addContent}
          removeContent={removeContent}
          setValue={setValue}
          setNodeType={setNodeType}
          isMarkdown={isMarkdown}
          nodeType={nodeType}
        />
      ))}
    </div>
  ),
);

SortableContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setNodeType: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool.isRequired,
  nodeType: PropTypes.object.isRequired,
};

export default SortableContainer;
