import React from 'react';

const CustomEvent = ({event}) => { 
  const { title } = event;
  console.log(event)
  return (<>
    <div>
      <ul>
        {
          event.employeeList.map((item, index)=>{
            return <li key={index}>{item}</li>
          })
        }
      </ul>
    </div>
  </>) 
}

export default CustomEvent;