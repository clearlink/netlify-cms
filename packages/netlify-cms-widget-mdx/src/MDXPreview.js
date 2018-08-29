import React from 'react';
import PropTypes from 'prop-types';
import { WidgetPreviewContainer } from 'netlify-cms-ui-default';
import { markdownToHtml } from 'netlify-cms-widget-markdown/src/serializers';

const MDXPreview = props => {
  if (props.value === null) {
    return null;
  }

  // Creates new array of markdown values then joins on double return
  const html = props.value.map(item => item.value).join('\n\n');

  return <WidgetPreviewContainer dangerouslySetInnerHTML={{ __html: markdownToHtml(html) }} />;
};

MDXPreview.propTypes = {
  value: PropTypes.array,
};

export default MDXPreview;
