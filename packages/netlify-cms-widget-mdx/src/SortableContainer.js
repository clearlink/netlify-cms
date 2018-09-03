import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer as ReactSortableContainer } from 'react-sortable-hoc';
import SortableElement from 'netlify-cms-widget-mdx/src/SortableElement';

const SortableContainer = ReactSortableContainer(
  ({
     nodes,
     addItem,
     removeContent,
     currentFocusID,
     setValue,
     setNodeType,
     isMarkdown,
     nodeType,
     onChangeObject,
     editorControl,
   }) => (
    <div>
      {nodes.map((node, idx) => (
        <SortableElement
          key={node.id}
          index={idx}
          position={idx}
          node={node}
          addItem={addItem}
          removeContent={removeContent}
          currentFocusID={currentFocusID}
          setValue={setValue}
          setNodeType={setNodeType}
          isMarkdown={isMarkdown}
          nodeType={nodeType}
          onChangeObject={onChangeObject}
          editorControl={editorControl}
        />
      ))}
    </div>
  ),
);

SortableContainer.propTypes = {
  nodes: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  currentFocusID: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setNodeType: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool.isRequired,
  nodeType: PropTypes.object.isRequired,
};

export default SortableContainer;
