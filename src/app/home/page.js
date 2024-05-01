import React from 'react'
import { UserInformation } from '@/components/UserInformation'

const page = async () => {

  

  return (
    <div className='grid grid-cols-8 mt-5 sm:px-5 mx-2'>
      <section className='col-span-8  md:col-span-2'>
      <UserInformation />

      </section>
    </div>
  )
}

export default page