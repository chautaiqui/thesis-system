import React from 'react';
import { useDrop } from 'react-dnd';

const CustomEvent = ({event}) => { 
  const { title } = event;
  // console.log(event)
  const [{ isOver, isOverCurrent }, drop] = useDrop(
		() => ({
			accept: 'box',
			drop(item, monitor) {
        console.log('dropped: ',event, item)
        event.assign(event._id, item.employee._id);     
			},
			collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
		})
	)
  return <div 
    ref={drop} 
    role={'dustbin'}
    style={{width: "100%", height: "100%"}}
  >
    <div>
      <ul>
        {
          event.employeeList.map((item, index)=>{
            return <li key={index}>{item}</li>
          })
        }
      </ul>
    </div>
  </div>
}

export default CustomEvent;