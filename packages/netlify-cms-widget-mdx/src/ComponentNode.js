import React, { Component } from 'react'
import { Map, fromJS } from 'immutable'


class ComponentNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  controlFor(field, key) {
    const { onChangeObject, editorControl: EditorControl } = this.props;
    console.log('Blah: ', onChangeObject, EditorControl)

    const testValue = this.props.value || 'Testing'

    if (field.get('widget') === 'hidden') {
      return null;
    }
    const fieldName = field.get('name');
    const fieldValue = testValue && Map.isMap(testValue) ? testValue.get(fieldName) : testValue;

    return <EditorControl key={key} field={field} value={fieldValue} onChange={onChangeObject} />;
  }

  handleCollapseToggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  renderFields = (fields) => {
    return fields.map((f, idx) => { console.log('Test: ', f) || this.controlFor(f, idx)});
  };

  render() {
    // TODO: Temporary Mess
    const component = this.props.node.field.get('categories').toJS()[0].components[0];
    const dummyFields = fromJS(component.fields)
    
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