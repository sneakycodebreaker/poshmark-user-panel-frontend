'use client'
import React, { useEffect, useState } from 'react'
import { fetchCloset } from '@/services/fetchCloset'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Form from 'react-bootstrap/Form';
import { fetchShareBack } from '@/services/fetchShareBack';
import { fetchFollowBack } from '@/services/fetchFollowBack';
import Image from 'next/image';

const News = () => {
  const [connectedCloset,setConnectedCloset] = useState([]);
  const [selectedCloset, setSelectedCloset] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState('');
  const [selectedClosetCookie,setSelectedClosetCookie] = useState('');
  const [selectedClosetId,setSelectedClosetId] = useState('');
  const [newsResponse, setNewsResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchCloset_(){
    let userId = localStorage.getItem('userId');
    let response = await fetchCloset(userId);
    setConnectedCloset(response?.closets);
  }

  async function fetchNewsData(selected){
    setLoading(true);
    setNewsResponse([]);
    if(selected === 'Share Back')
    {
      let response = await fetchShareBack(selectedClosetId,selectedClosetCookie);
      setNewsResponse(response)

    }
    if(selected === 'Follow Back')
    {
      let response = await fetchFollowBack(selectedClosetId,selectedClosetCookie);
      setNewsResponse(response)
    }
    setLoading(false)
  }

 useEffect(()=>{
  fetchCloset_();
 },[])
  return (
    <div>
         <div className="py-2 px-4 flex flex-col gap-2 bg-white rounded mt-3 mb-2">
            <h4 className='font-semibold border-b pb-1'>Connected Closets</h4>
            <div className="flex flex-row gap-3 ">     
            {
                connectedCloset.map((closet,index)=>(
                <div key={index} className='flex flex-row gap-2 items-center'>
                  <Form.Check
                    type={'radio'}
                    name="closet"
                    checked={selectedCloset === index}
                    onChange={(e) => {
                      setNewsResponse([]);
                      setSelectedCloset(index)
                      setSelectedClosetCookie(closet.cookie);
                      setSelectedClosetId(closet.closet_id);
                      setSelectedDropdown('');
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
        <div className='px-4 py-2 bg-white rounded-lg mb-2'>

            <div className='flex flex-row justify-between items-center'>
                <div>
                  <p className='text-lg font-semibold'>{selectedDropdown}</p>
                </div>
                <div className='flex flex-row justify-end'>
                  <Form.Select className='md:w-64' 
                  disabled={selectedCloset === null ? true : false}
                  value={selectedDropdown}
                  onChange={(e)=>{
                    setSelectedDropdown(e.target.value);
                    fetchNewsData(e.target.value)
                  }}
                  >
                    <option>Open to select</option>
                    <option value="Share Back">Share Back</option>
                    <option value="Follow Back">Follow Back</option>
                    <option value="Like">Like</option>
                  </Form.Select>
                </div>
            </div>

            <div>
              {
                newsResponse?.length == 0 ?
                <p className="text-base font-semibold text-center">{loading ? 'fetching Data...' : 'No News'}</p>
                :
                <div className='grid grid-cols-5 gap-3 mt-4'>
                    {
                        newsResponse.map((item,index)=>(
                        <div key={index} className='bg-white rounded border drop-shadow '>
                            <Image
                            src={item?.picture}
                            height={100}
                            width={206}
                            alt='User Image'
                            className='rounded-t'
                            />
                            
                            <div className='flex flex-col p-2 text-wrap gap-1'>
                                <span className='line-clamp-2 font-serif'>{item?.username}</span>           
                            </div>
                        </div>
                        ))
                    }        
                </div>
              }

            </div>
           
        </div>
    </div>
  )
}

export default News