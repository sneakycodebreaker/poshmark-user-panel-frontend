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
import { fetchCloset } from '@/services/fetchCloset';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const ShareLogs = () => {

    const logs = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()

   const [shareItemsStatus, setSharedItemStatus] = useState('');
   const [socket, setSocket] = useState(null);

   const [connectedCloset,setConnectedCloset] = useState([]);
   const [selectedCloset, setSelectedCloset] = useState(null);
   const [selectedLogs, setSelectedLogs] = useState('Share');

   async function fetchCloset_(){
    let userId = localStorage.getItem('userId');
    let response = await fetchCloset(userId);
    setConnectedCloset(response?.closets);
  }

   useEffect(() => {
        fetchCloset_();
       const newSocket = io("http://173.230.151.165:3001");
       setSocket(newSocket);
       return () => {
           newSocket.disconnect();
       };
   }, []);

   useEffect(() => {
       
       if (socket) {
           socket.on('itemShared', item => {
                console.log('itemShared', item);
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

    <>
     {/* Connected Closet */}
        {/* <div className="py-2 px-4 flex flex-col gap-2 bg-white rounded mt-3 mb-2">
            <h4 className='font-semibold border-b pb-1'>Connected Closets</h4>
            <div className="flex flex-row gap-3 ">     
            {
                connectedCloset.map((closet,index)=>(
                <div key={index} className={`${selectedCloset == index ? 'border-b-2 border-blue-500' : ''} pb-2 `} onClick={()=>{setSelectedCloset(index)}}>
                    <Avatar className='cursor-pointer w-10 h-10' >
                    <AvatarImage src={closet.closet_img}  />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar> 
                </div>
                
                ))
            }
            </div>
        </div> */}
        <div className='px-4 py-2 bg-white rounded-lg mb-2 mt-3'>

          <div className='flex flex-row gap-3  border-b mb-3'>
            <div onClick={()=>{setSelectedLogs("Share")}} className={`${selectedLogs === 'Share' ? 'border-b-2 border-blue-500 pb-1' : ""} cursor-pointer`}>
                <p className="text-lg">Share Logs</p>
            </div>
            {/* <div onClick={()=>{setSelectedLogs("Follow")}} className={`${selectedLogs === 'Follow' ? 'border-b-2 border-blue-500 pb-1' : ""} cursor-pointer`}>
                <p className="text-lg">Follow Logs</p>
            </div> */}
            
          </div>
          {
            logs?.length == 0 ?
            <p className="text-base font-semibold text-center">No logs</p>
            :
            <div className='grid grid-cols-5 gap-3'>
                {
                    logs.map((item,index)=>(

                    <div key={index} className='bg-white rounded border drop-shadow '>
                        <img src={item?.picture_url} 
                        className='w-56 h-44 rounded-t'/>
                        <div className='flex flex-col p-2 text-wrap gap-1'>
                            <span className='line-clamp-1 font-serif'>{item?.title}</span>
                          
                            <div className='flex flex-col'>
                                <span className='font-semibold '>${item?.price}</span>
                                <span className='text-sm font-semibold '>Size: <span className='font-normal'>{item?.size}</span></span>
                            </div>             
                        </div>
                    </div>
                    ))
                }        
            </div>
          }
        </div>
    </>
    
   )
}

export default ShareLogs;