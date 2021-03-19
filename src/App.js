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