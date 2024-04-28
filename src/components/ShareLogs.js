'use client'
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addingLogs } from '@/utils/logsSlice';

const ShareLogs = () => {

    const logs = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()

   const [shareItemsStatus, setSharedItemStatus] = useState('');
   const [socket, setSocket] = useState(null);

   useEffect(() => {
       const newSocket = io("https://173.230.151.165:3001");
       setSocket(newSocket);
       return () => {
           newSocket.disconnect();
       };
   }, []);

   useEffect(() => {
       if (socket) {
           socket.on('itemShared', item => {
            
                if(typeof(item) === 'string') 
                {
                    setSharedItemStatus(item)
                }
                if(typeof(item) === 'object')
                {
                    dispatch(addingLogs(item));
                }
              
           });
       }
   }, [socket]);

 

   return (
    <div className='m-4 p-4 bg-white rounded-lg'>
          <div className='flex flex-row justify-between pb-2 px-1'>
            <p className="text-lg font-semibold">Share Logs</p>
            <p className="text-lg font-semibold text-right">Total: {logs.length}</p>
          </div>
          {
            logs?.length == 0 ?
            <p className="text-base font-semibold text-center">{shareItemsStatus === '' ? "No Share logs" : shareItemsStatus}</p>
            :
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px] p-2">Image</TableHead>
                <TableHead className="p-2">Title</TableHead>
                <TableHead className="w-[100px] p-2">Category</TableHead>
                <TableHead className="w-[100px] p-2">Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            <>
              {
                logs?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className='p-2'>
                            <Image 
                                src={item?.picture_url}
                                alt="Item Picture"
                                width={48}
                                height={48}
                                className='rounded-full'
                            />
                        </TableCell>
                        <TableCell className='p-2'>
                            <p>{item?.title}</p> 
                        </TableCell>
                        <TableCell className='p-2'>{item?.category}</TableCell>
                        <TableCell className='p-2'>{item?.price}</TableCell>
                    </TableRow>
                ))
              }
            </>                  
            </TableBody>
            </Table>
          }
    </div>
   )
}

export default ShareLogs;