import React from 'react';
import PropTypes from 'prop-types';
import { WidgetPreviewContainer } from 'netlify-cms-ui-default';
import { markdownToHtml } from '../../netlify-cms-widget-markdown/src/serializers';

const ComponentsPreview = (props) => {
  if (props.value === null) {
    return null;
  }

  // Creates new array of markdown values then joins on double return
  const html = props.value.map(item => item.value).join('\n\n');

  return (
    <WidgetPreviewContainer dangerouslySetInnerHTML={{ __html: markdownToHtml(html) }} />
  )
};

ComponentsPreview.propTypes = {
  value: PropTypes.string,
};

export default ComponentsPreview;
