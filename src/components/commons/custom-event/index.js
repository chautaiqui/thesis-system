import React from 'react';
import { useDrop } from 'react-dnd';

function getStyle(backgroundColor) {
  return {
      backgroundColor,
      width: "100%",
      height: "100%"
  };
}

const CustomEvent = ({event}) => { 
  const { title } = event;
  var backgroundColor;
  const [{ isOver, isOverCurrent }, drop] = useDrop(
		() => ({
			accept: 'box',
			drop(item, monitor) {
        // console.log('dropped: ',event, item)
        event.assign(event._id, item.employee._id);     
			},
			collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
		})
	)
  if (isOverCurrent || isOver) {
    backgroundColor = '#00CC66';
  } 
  return <div 
    ref={drop} 
    role={'dustbin'}
    style={getStyle(backgroundColor)}
  >
    <div>
      <ul>
        {
          event.employeeList.map((item, index)=>{
            return <li key={index}>{item.name}</li>
          })
        }
      </ul>
    </div>
  </div>
}

export default CustomEvent;