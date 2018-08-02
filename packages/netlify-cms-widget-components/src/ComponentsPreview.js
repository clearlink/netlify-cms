import React from 'react';
import PropTypes from 'prop-types';
import { WidgetPreviewContainer } from 'netlify-cms-ui-default';

const ComponentsPreview = ({ value }) => (
  <WidgetPreviewContainer>{value ? value.toString() : null}</WidgetPreviewContainer>
);

ComponentsPreview.propTypes = {
  value: PropTypes.object,
};

export default ComponentsPreview;