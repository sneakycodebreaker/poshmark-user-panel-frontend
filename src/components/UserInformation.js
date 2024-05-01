'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const UserInformation = () => {



  return (
    <div className='flex flex-col justify-center items-center bg-white rounded-lg border py-4'>
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='text-center'>
            <p className='font-semibold'>
                Dummy user
            </p>
        </div>
    </div>
  )
}
