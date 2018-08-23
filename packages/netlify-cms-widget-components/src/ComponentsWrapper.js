import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer } from 'react-sortable-hoc';
import ComponentPart from './ComponentPart';

const ComponentsWrapper = SortableContainer(
  ({
     items,
     currentFocusID,
     addContent,
     handleBackspace,
     setValue,
     setNodeType,
     isMarkdown,
     nodeIsMarkdown,
     nodeType,
  }) => (
    <div>
      {items.map((item, idx) => (
        <ComponentPart
          key={item.id}
          uuid={item.id}
          index={idx}
          value={item.value}
          position={idx}
          currentFocusID={currentFocusID}
          addContent={addContent}
          handleBackspace={handleBackspace}
          setValue={setValue}
          setNodeType={setNodeType}
          isMarkdown={isMarkdown}
          nodeType={nodeType}
        />
      ))}
    </div>
  ),
);

ComponentsWrapper.propTypes = {
  addContent: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setNodeType: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool.isRequired,
  nodeType: PropTypes.object.isRequired,
};

export default ComponentsWrapper;
