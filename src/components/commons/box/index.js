import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const style = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '0.5rem 1rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	cursor: 'move',
	textAlign: 'center',
  width: '100%'
}

export const Box = ({ employee }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "box",
		item: { employee },
		end: (item, monitor) => {
			if (item) {
				// console.log('drop: ',item)
			}
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
			handlerId: monitor.getHandlerId(),
		}),
	}))

	const opacity = isDragging ? 0.4 : 1;
	return (
		<div
			ref={drag}
			role="box"
			style={{ ...style, opacity }}
		>
			{employee.name}
		</div>
	)
}

export function Target(props) {
  const [{ isOver, isOverCurrent }, drop] = useDrop(
		() => ({
			accept: 'box',
			drop(item, monitor) {
        console.log(props.id, item)
				const didDrop = monitor.didDrop()
				if (didDrop) {
          console.log(item, props.id)
					return
				}
			},
			collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
		})
	)
  return <div 
    ref={drop} 
    role={'Dustbin'}
    className="target"
  >
    Drop Target
  </div>
}