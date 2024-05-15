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
import { fetchLogs } from '@/services/fetchLogs';
const ShareLogs = () => {

    //-------------Image slow rendering ----------------------------
    const self_share_logs = useSelector((state) => state.counter.self_share_value);
    const follow_back_logs = useSelector((state) => state.counter.follow_back_value);
    const share_back_logs = useSelector((state) => state.counter.share_back_value);
    const dispatch = useDispatch();

   const [shareItemsStatus, setSharedItemStatus] = useState('');
   const [socket, setSocket] = useState(null);

   const [connectedCloset,setConnectedCloset] = useState([]);
   const [selectedCloset, setSelectedCloset] = useState(null);
   const [selectedDropdown, setSelectedDropdown] = useState('');

   const [selectedClosetId,setSelectedClosetId] = useState('');

   const [selfShareLogs,setSelfShareLogs] = useState([]);
   const [followBackLogs,setFollowBackLogs] = useState([]);
   const [shareBackLogs,setShareBackLogs] = useState([]);

   const [loadings,setLoadings] = useState(true);

   async function fetchCloset_(){
    let userId = localStorage.getItem('userId');
    let response = await fetchCloset(userId);
    setConnectedCloset(response?.closets);
  }

   async function fetchLogs_(type){
    setLoadings(true);
    let userId = localStorage.getItem('userId');
    let response =  await fetchLogs(userId,selectedClosetId,type);
    console.log(response);
    if(type == 'Self Share')
    {
        setSelfShareLogs(response.logs);
    }
    if(type == 'Share Back'){
        setShareBackLogs(response.logs)
    }
    if(type == 'Follow Back'){
        setFollowBackLogs(response.logs)
    }
    setLoadings(false);
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
            console.log(item);
                if(item.uid === localStorage.getItem('userId'))
                {
                    if(typeof(item.packet) === 'object')
                    {
                        dispatch(addingSelfShareLogs(item.packet));
                    }           
                }              
            });

            socket.on('Shared Back', item => {
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

    useEffect(() => {
        if (self_share_logs !== undefined && loadings === false ) {
            setSelfShareLogs(prevArray => {
                // const existingIds = new Set(prevArray.map(item => item.userId));
                // const filteredNewArray = self_share_logs.filter(item => !existingIds.has(item.userId));
                // console.log('filteredNewArray :',filteredNewArray);
                return [...prevArray, ...self_share_logs];
            });
        }
    }, [self_share_logs]);

    useEffect(() => {
        if (follow_back_logs !== undefined && loadings === false ) {
            console.log('follow_back_logs ',follow_back_logs);
            setFollowBackLogs(prevArray => {
                // const existingIds = new Set(prevArray.map(item => item.userId));
                // const filteredNewArray = follow_back_logs.filter(item => !existingIds.has(item.userId));
                // console.log('filteredNewArray :',filteredNewArray);
                return [...prevArray, ...follow_back_logs];
            });
        }
    }, [follow_back_logs]);


    useEffect(() => {
        if (share_back_logs !== undefined && loadings === false ) {
            setShareBackLogs(prevArray => {
                // const existingIds = new Set(prevArray.map(item => item.userId));
                // const filteredNewArray = share_back_logs.filter(item => !existingIds.has(item.userId));
                return [...prevArray, ...share_back_logs];
            });
        }
    }, [share_back_logs]);


   return (

    <>
     {/* Connected Closet */}
        <div className="py-2 px-4 flex flex-col gap-2 bg-white rounded mt-3 mb-2">
            <h4 className='font-semibold border-b pb-1'>Connected Closets</h4>
            <div className="flex flex-row gap-3 ">     
            {
                connectedCloset.map((closet,index)=>(
                <div key={index}  className="flex flex-row gap-2 items-center pb-2" onClick={()=>{setSelectedCloset(index)}}>
                     <Form.Check
                        type={'radio'}
                        name="closet"
                        checked={selectedCloset === index}
                        onChange={(e) => {
                        setSelectedCloset(index); 
                        setSelectedClosetId(closet.closet_id);
                        }}
                    />
                    
                    <Avatar className='cursor-pointer w-10 h-10' >
                    <AvatarImage src={closet.closet_img}  />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar> 
                </div>
                
                ))
            }
            </div>
        </div>
        <div className='px-4 py-2 bg-white rounded-lg mb-2 mt-3'>

        <div className='flex flex-row justify-between items-center mb-2'>
                <div>
                  <p className='text-lg font-semibold' onClick={()=>{console.log(selfShareLogs);}}>{selectedDropdown}</p>
                </div>
                <div className='flex flex-row justify-end'>
                  <Form.Select className='md:w-64' 
                  disabled={selectedCloset === null? true : false}
                  value={selectedDropdown}
                  onChange={(e)=>{            
                    setSelectedDropdown(e.target.value);
                    fetchLogs_(e.target.value);
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
                    selfShareLogs?.length == 0 ?
                    <p className="text-base font-semibold text-center">{loadings ? "fetching logs ..." : "No logs"}</p>
                    :
                    <div className='grid grid-cols-5 gap-3'>
                        {
                            selfShareLogs?.slice().reverse().map((item,index)=>(

                            <>
                            {
                                selectedClosetId ===  item.closet_id?
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
                                :
                                ''
                            }
                            </>

                            
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
                    followBackLogs?.length == 0 ?
                    <p className="text-base font-semibold text-center">{loadings ? "fetching logs ..." : "No logs"}</p>
                    :
                    <div className='grid grid-cols-5 gap-3'>
                        {
                            followBackLogs?.slice().reverse().map((item,index)=>(
                             <>
                                {
                                    selectedClosetId == item.closet_id ?
                                    <div key={index} className='bg-white rounded border drop-shadow '>
                                        <img src={item?.picture} 
                                        className='w-56 h-44 rounded-t'/>
                                        <div className='flex flex-col p-2 text-wrap gap-1'>
                                            <span className='line-clamp-1 font-serif'>{item?.username}</span>           
                                        </div>
                                    </div>
                                    :
                                    ''
                                }
                             </>
                          
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
                    shareBackLogs?.length == 0 ?
                    <p className="text-base font-semibold text-center">{loadings ? "fetching logs ..." : "No logs"}</p>
                    :
                    <div className='grid grid-cols-5 gap-3'>
                        {
                            shareBackLogs?.slice().reverse().map((item,index)=>(
                            <>
                            {
                                selectedClosetId == item.closet_id ?
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
                                :
                                ''
                            }
                            </>                     
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