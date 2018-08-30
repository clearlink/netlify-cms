import React, { Component } from 'react'
import { fromJS } from 'immutable'


class ComponentNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  controlFor(field, key) {
    const { value, onChangeObject, editorControl: EditorControl } = this.props;

    if (field.get('widget') === 'hidden') {
      return null;
    }
    const fieldName = field.get('name');
    const fieldValue = value && Map.isMap(value) ? value.get(fieldName) : value;

    return <EditorControl key={key} field={field} value={fieldValue} onChange={onChangeObject} />;
  }

  handleCollapseToggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  renderFields = (fields) => {
    return fields.map((f, idx) => { console.log('Test: ', f.toJS()) || this.controlFor(f, idx)});
  };

  render() {
    // TODO: Temporary Mess
    const component = this.props.node.field.get('categories').toJS()[0].components[0];
    const dummyFields = fromJS(component.fields)
    console.log(dummyFields)

    // const { node } = this.props;

    // for (const cat of node.field.get('categories')) {
    //   for (const component of cat.get('components')) {
    //     console.log(component.toJS())
    //   }
    // }
    
    if (dummyFields) {
      return (
        <div>
          {this.renderFields(dummyFields)}
        </div>
      );
    }
    return <h3>No field(s) defined for this component.</h3>
  }
}

export default ComponentNode