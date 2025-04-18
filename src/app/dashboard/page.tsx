
import React from 'react'
import Navbar from '../_components/Navbar'
import UserList from './_components/UserList'
import CallNotification from './_components/CallNotification'
import VideoCall from './_components/VideoCall'

const page = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <UserList />
        <VideoCall />
        <CallNotification />
      </div>
    </>
  )
}

export default page;
