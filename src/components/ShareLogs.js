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
import {addingSelfShareLogs,addingFollowBackLogs,addingShareBackLogs} from '@/utils/logsSlice';
import { fetchCloset } from '@/services/fetchCloset';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Form from 'react-bootstrap/Form';
const ShareLogs = () => {

    //-------------Image slow rendering ----------------------------
    const self_share_logs = useSelector((state) => state.counter.self_share_value);
    const follow_back_logs = useSelector((state) => state.counter.follow_back_value);
    const share_back_logs = useSelector((state) => state.counter.share_back_value);
    const dispatch = useDispatch()

   const [shareItemsStatus, setSharedItemStatus] = useState('');
   const [socket, setSocket] = useState(null);

   const [connectedCloset,setConnectedCloset] = useState([]);
   const [selectedCloset, setSelectedCloset] = useState(null);
   const [selectedDropdown, setSelectedDropdown] = useState('');

   async function fetchCloset_(){
    let userId = localStorage.getItem('userId');
    let response = await fetchCloset(userId);
    setConnectedCloset(response?.closets);
  }

   useEffect(() => {  
       const newSocket = io("http://173.230.151.165:3001");
       setSocket(newSocket);
       fetchCloset_();
       return () => {
           newSocket.disconnect();
       };
   }, []);

   useEffect(() => {
       
       if (socket) {

           socket.on('Followed Back', item => {
                if(item.uid === localStorage.getItem('userId'))
                {   
                    if(typeof(item.packet) === 'object')
                    {
                        dispatch(addingFollowBackLogs(item.packet));
                    }           
                } 
              
           });
           socket.on('Self Share', item => {
                if(item.uid === localStorage.getItem('userId'))
                {
                    if(typeof(item.packet) === 'object')
                    {
                        dispatch(addingSelfShareLogs(item.packet));
                    }           
                }              
            });

            socket.on('Shared Back', item => {
                console.log(item);
                if(item.uid === localStorage.getItem('userId'))
                {
                    if(typeof(item.packet) === 'object')
                    {
                        dispatch(addingShareBackLogs(item.packet));
                    }           
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

        <div className='flex flex-row justify-between items-center'>
                <div>
                  <p className='text-lg font-semibold'>{selectedDropdown}</p>
                </div>
                <div className='flex flex-row justify-end'>
                  <Form.Select className='md:w-64' 
                  value={selectedDropdown}
                  onChange={(e)=>{
                    setSelectedDropdown(e.target.value);
                  }}
                  >
                    <option>Open to select</option>
                    <option value="Self Share">Self Share</option>
                    <option value="Share Back">Share Back</option>
                    <option value="Follow Back">Follow Back</option>
                    {/* <option value="Like">Like</option> */}
                  </Form.Select>
                </div>
            </div>
            {
                selectedDropdown  === 'Self Share' &&
                <>
                 {
                    self_share_logs?.length == 0 ?
                    <p className="text-base font-semibold text-center">No logs</p>
                    :
                    <div className='grid grid-cols-5 gap-3'>
                        {
                            self_share_logs?.slice().reverse().map((item,index)=>(

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
                </>
            }

            {
                selectedDropdown  === 'Follow Back' &&
                <>
                 {
                    follow_back_logs?.length == 0 ?
                    <p className="text-base font-semibold text-center">No logs</p>
                    :
                    <div className='grid grid-cols-5 gap-3'>
                        {
                            follow_back_logs?.slice().reverse().map((item,index)=>(

                            <div key={index} className='bg-white rounded border drop-shadow '>
                                <img src={item?.picture} 
                                className='w-56 h-44 rounded-t'/>
                                <div className='flex flex-col p-2 text-wrap gap-1'>
                                    <span className='line-clamp-1 font-serif'>{item?.username}</span>           
                                </div>
                            </div>
                            ))
                        }        
                    </div>
                }
                </>
            }

            {
                selectedDropdown  === 'Share Back' &&
                <>
                 {
                    share_back_logs?.length == 0 ?
                    <p className="text-base font-semibold text-center">No logs</p>
                    :
                    <div className='grid grid-cols-5 gap-3'>
                        {
                            share_back_logs?.slice().reverse().map((item,index)=>(

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
                </>
            }

         
        </div>
    </>
    
   )
}

export default ShareLogs;