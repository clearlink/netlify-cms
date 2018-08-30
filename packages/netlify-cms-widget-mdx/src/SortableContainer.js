import React from 'react';
import PropTypes from 'prop-types';

import { SortableContainer as ReactSortableContainer } from 'react-sortable-hoc';

const SortableContainer = ReactSortableContainer(({ renderContentNodes }) => (
  <div>{renderContentNodes()}</div>
));

SortableContainer.propTypes = {
  renderContentNodes: PropTypes.func.isRequired,
};

export default SortableContainer;
