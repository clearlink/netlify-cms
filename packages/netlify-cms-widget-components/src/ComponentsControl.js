import React, { Component } from 'react'

export default class ComponentsControl extends Component {
  render() {
    console.log(this.props)
    const { field } = this.props
    console.log(`chicken: ${field.get('title')}`)
    return (
      <div>
        I am in control        
      </div>
    )
  }
}
