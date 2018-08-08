import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer } from 'react-sortable-hoc';
import ComponentPart from './ComponentPart';

const ComponentsWrapper = SortableContainer(
  ({ items, handleEnter, handleBackspace, setValue }) => (
    <div>
      {items.map((item, idx) => (
        <ComponentPart
          key={item.id}
          index={idx}
          value={item.value}
          position={idx}
          handleEnter={handleEnter}
          handleBackspace={handleBackspace}
          setValue={setValue}
        />
      ))}
    </div>
  )
);

ComponentsWrapper.propTypes = {
  handleEnter: PropTypes.func.isRequired,
  handleBackspace: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default ComponentsWrapper;
