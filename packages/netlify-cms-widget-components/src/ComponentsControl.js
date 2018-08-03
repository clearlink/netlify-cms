import React, { Component } from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { css } from 'react-emotion'

const DragHandle = SortableHandle(() => <span>:: </span>)
const ComponentPart = SortableElement(({value}) => (
  <div className={
    css`
      display: flex;
      width: 100%;
      border: 1px dashed lightgray;
      padding: .5rem;
      margin: .5rem 0;
    `}
  >
    <DragHandle />
    <div contentEditable>{value}</div>
  </div>
  )
)

const ComponentsWrapper = SortableContainer(({items}) => (
  <div>
    {items.map((value, idx) => <ComponentPart key={idx} index={idx} value={value} />)}
  </div>
  )
)


export default class ComponentsControl extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: '',
      items: ['1', '2', '3', '4'],
    }

    this.handleInput = this.handleInput.bind(this)
  }

  handleInput(evt) {
    console.log(evt.target)
    this.setState({
      content: evt.target.textContent,
    })
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    })
  }

  render() {
    const { field } = this.props
    const cats = field.get('categories')

    for (const cat of cats) {
      console.log(cat.get('label'))
      console.log(cat.get('name'))
      console.log(cat.get('components'))
    }

    return (
      <div className="components__container">
        <ComponentsWrapper items={this.state.items} onSortEnd={this.handleSortEnd} useDragHandle={true} />
        <textarea value={this.state.content} />
      </div>
    )
  }
}
