import React from 'react';
import CurrentUser from '@components/auth/currentUser';
import RouterContainer from '@pkg/router';

export default function App() {
  return (
    <CurrentUser>
      <RouterContainer />
    </CurrentUser>
  )
}

// export default function App() {
//   const childRef = React.useRef();
//   return (
//     <div className="container">
//       <div>
//         Parent Component
//       </div>  
//       <button onClick={()=>{
//         childRef.current.hello()
//        }}>
//         Call Function
//       </button>
//       <Child ref={childRef}/>
//     </div>
// )
// }

// const Child = React.forwardRef((props, ref) => {

//   const hello = () => {
//     alert("Hello")
//   }
//   React.useImperativeHandle(
//       ref,
//       () => ({
//         showAlert() {
//             alert("Child Function Called")
//         },
//         hello
//     }),
//    )
//   //  const onChange = () => {
  
//   //  }
//    return (
//        <div>Child Component</div>
//    )
// })