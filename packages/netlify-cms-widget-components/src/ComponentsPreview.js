import React from 'react';
import PropTypes from 'prop-types';
import { WidgetPreviewContainer } from 'netlify-cms-ui-default';
import { markdownToHtml } from '../../netlify-cms-widget-markdown/src/serializers';

const logMessage = (label, ...messages) => {
  console.log(`%c COMPONENTS PREVIEW ${label}`, 'color: lime', ...messages);
};

const ComponentsPreview = (props) => {
  logMessage('props', props);
  if (props.value === null) {
    return null;
  }
  return props.value.map((item, index) => {
    logMessage('value map', item);
    const html = markdownToHtml(item.value);
    return <WidgetPreviewContainer dangerouslySetInnerHTML={{ __html: html }}/>;
  });
};

ComponentsPreview.propTypes = {
  value: PropTypes.string,
};

export default ComponentsPreview;
