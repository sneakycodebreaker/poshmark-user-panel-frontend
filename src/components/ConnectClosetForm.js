'use client'
import React,{useEffect,useState} from 'react'
import Form from 'react-bootstrap/Form';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ClosetItems from './ClosetItems';
import ClosetFollowers from './ClosetFollowers';
import ClosetFollowing from './ClosetFollowing';
import { connectCloset } from '@/services/connectCloset';
import { Skeleton } from "@/components/ui/skeleton"
import { addCloset } from '@/services/addCloset';
import { checkCloset } from '@/services/checkCloset';
import { fetchClosetStats } from '@/services/fetchClosetStats';
import { fetchCloset } from '@/services/fetchCloset';
import { removeCloset } from '@/services/removeCloset';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'next/image';
import { CircleX } from 'lucide-react';


const ConnectClosetForm = () => {
    const [closetName,setClosetName] = useState('');
    const [closetPassword,setClosetPassword] = useState('');
    const [closetCountry,setClosetCountry] = useState('');
    const [closetNameCheck,setClosetNameCheck] = useState('');
    const [closetPasswordCheck,setClosetPasswordCheck] = useState('');
    const [closetCountryCheck,setClosetCountryCheck] = useState('')

    const [connectedCloset,setConnectedCloset] = useState([]);
    const [loading,setLoading] = useState(false);
    const [connectionBox,setConnectionBox] = useState(false);
    const [closetStatus,setClosetStatus] = useState(false);
    const [tab,setTab] = useState('');

    const [linkedClosetCheck,setLinkedClosetCheck] = useState(false);

    async function connectClosetFun(){
        setLinkedClosetCheck(false)
        let userId = localStorage.getItem('userId');
        if(closetName === '')
        {
            setClosetNameCheck(true);
            return
        }
        if(closetPassword === '')
        {
            setClosetPasswordCheck(true);
            return
        }
        if(closetCountry === '')
        {
            setClosetCountryCheck(true);
            return
        }
        //------Add country check ------------
        let dynamicCase ='closet_check'
        let closetCheckResponse = await checkCloset(dynamicCase,closetName,userId);
        console.log(closetCheckResponse);
       //-------- Closet Check not returning same Json-------------------------
        if(closetCheckResponse.message === 'closet linked')
        {
            setLinkedClosetCheck(true);
            return
        }
        if(closetCheckResponse.message == 'allow')
        {
            setLoading(true);
            setConnectionBox(false);
         
            let response =  await connectCloset(closetName,closetPassword);
           
            dynamicCase = 'poshmark';
            let closet_id = response?.ui?.uid;
            let closetName_ = response?.ui?.dh;
            let country_ = closetCountry;
            let closetImage_ = response?.ui?.uit
            let cookie_ = response?.cookie


            let closetAdd = await addCloset(dynamicCase,userId,closet_id,closetName,closetName_,country_,closetImage_,cookie_);

            const response_ = await fetchClosetStats(closet_id, cookie_);

            let newClosetObj = {
                id : closetAdd?.message,
                user_id : userId,
                posh_id : null,
                closet_id : closet_id,
                closetname : closetName_,
                closetname_entered :closetName,
                country : country_,
                closet_img : closetImage_,
                cookie : cookie_,
                proxy : null,
                new_closets_shared: response_.new_closets_shared,
                community_shares: response_.community_shares,
                self_shares: response_.self_shares,
                available_listings: response_.available_listings
            }
           
            setConnectedCloset(prevArray => [...prevArray, newClosetObj]);

            setClosetStatus(true);
            setLoading(false);
        }
       
    }

    async function logoutCloset(closet_id) {
        let userId = localStorage.getItem('userId');
        setConnectedCloset(prevArray => prevArray.filter(closet => closet.closet_id !== closet_id));
        let response = await removeCloset(userId,closet_id);
    }

    async function fetchCloset_() {
        let userId = localStorage.getItem('userId');
        let response = await fetchCloset(userId);
        let promises = response?.closets.map(async (element, index) => {
            const response_ = await fetchClosetStats(element.closet_id, element.cookie);
            return {
                ...element,
                new_closets_shared: response_.new_closets_shared,
                community_shares: response_.community_shares,
                self_shares: response_.self_shares,
                available_listings: response_.available_listings
            };
        });
        let updatedClosets = await Promise.all(promises); 
        setConnectedCloset(updatedClosets);
    }



    useEffect(()=>{
        fetchCloset_()
    },[])

  return (
    <main className='flex flex-col gap-3'>
    
    <div className='flex items-center justify-between border-b pb-2'>
        <div>
            {
                loading ?
                <p className='font-semibold text-lg'>Connecting closet (Due to captcha, the login can take upto 2 minutes)</p>
                :
                <p className='font-semibold text-lg'>Connect closet</p>

            }
          
        </div>      
        <div>
            <Button disabled={loading} variant="outline" onClick={()=>{setConnectionBox(!connectionBox); setLinkedClosetCheck(false)}}>{connectionBox ? 'Back' : 'Connect'}</Button>
        </div>
    </div>

    {
        connectionBox &&
        <div className='flex flex-row items-end justify-between gap-4 bg-white rounded lg p-4 '>
            <Form className='flex gap-3 flex-1'>
                <Form.Group className='w-100'>
                    <Form.Label className='font-semibold'>Closet Name</Form.Label>
                    <Form.Control isInvalid={closetNameCheck} className='focus:outline-none' type="text" placeholder="Enter closet name" onChange={(e)=>{
                        setClosetName(e.target.value);
                        closetNameCheck ? setClosetNameCheck(false):'';
                        }}/>
                </Form.Group>
                <Form.Group className='w-100'>
                    <Form.Label className='font-semibold'>Closet Password</Form.Label>
                    <Form.Control isInvalid={closetPasswordCheck} className='focus:outline-none' type="password" placeholder="Enter closet password" onChange={(e)=>{
                        setClosetPassword(e.target.value);
                        closetPasswordCheck ? setClosetPasswordCheck(false):'';
                    }}/>
                </Form.Group>
            </Form>
            <div>
                <Form.Label className='font-semibold mb-3'>Closet Country</Form.Label>
                <div>
                    <Form.Check
                    isInvalid={closetCountryCheck}
                    inline
                    label="us"
                    value={'us'}
                    name="country"
                    type={'radio'}
                    onChange={(e)=>{
                        setClosetCountry(e.target.value);
                        closetCountryCheck ? setClosetCountryCheck(false) : ''
                    }}
                    />
                    <Form.Check
                      isInvalid={closetCountryCheck}
                        inline
                        label="ca"
                        value={'ca'}
                        name="country"
                        type={'radio'}
                        onChange={(e)=>{
                            setClosetCountry(e.target.value);
                            closetCountryCheck ? setClosetCountryCheck(false) : ''
                        }}
                    />
                </div>
             
            </div>
            <div>
                <Button variant="outline" onClick={connectClosetFun}>Submit</Button>
            </div>
        </div>
    }
    {
        linkedClosetCheck && 
        <div>
            <p className='text-center text-rose-700 font-semibold text-lg'>Closet already linked, try another one!</p>
        </div>
    }
    {
        loading &&
        <div className='flex flex-col justify-center items-start bg-white rounded-lg border py-4 px-4'>
                <div className='flex flex-col justify-center items-center border-b w-full gap-2 pb-2'>
                    <Skeleton className="h-12 w-12 rounded-full flex items-center justify-center">
                    <Spinner animation="border" role="status"/>
                    </Skeleton>  
                    <Skeleton className="h-4 w-52"/> 
                </div>
            
            </div>
    }
     <>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='font-semibold text-lg'>Connected Closets</p>
                </div>      
            </div>
          {
            connectedCloset.map((closet,key)=>(
                <div key={key} className='flex flex-col  bg-white rounded-lg border px-3 py-2 gap-2 drop-shadow'>
                    <div className='flex flex-row justify-end items-center pb-2'>
                        <CircleX className='text-red-600 cursor-pointer' onClick={()=>{logoutCloset(closet?.closet_id)}}/>
                    </div>
                    <div className='flex flex-row justify-between items-center  w-full gap-5 pb-2'>
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <Image
                                src={closet.closet_img}
                                width={80}
                                height={80}
                                className='rounded'
                                alt='CN'
                                />
                                <div className='text-center'>
                                    <p className='font-semibold'>
                                    {closet.closetname}
                                    </p>
                                </div>   
                            </div>
                             <div>
                                <div className='flex flex-col gap-1 '>
                                    <div className='flex flex-row justify-between items-center gap-3'>
                                        <h2 className='font-semibold'>Self Shares:</h2>
                                        <span>{closet.self_shares}</span>
                                    </div>
                                    <div className='flex flex-row justify-between items-center gap-3'>
                                        <h2 className='font-semibold'>Available Listings:</h2>
                                        <span>{closet.available_listings}</span>
                                    </div>
                                    <div className='flex flex-row justify-between items-center gap-3'>
                                        <h2 className='font-semibold'>Community Shares:</h2>
                                        <span>{closet.community_shares}</span>
                                    </div>
                                    <div className='flex flex-row justify-between items-center gap-3'>
                                        <h2 className='font-semibold'>New Poshers Shared:</h2>
                                        <span>{closet.new_closets_shared}</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            ))
          }
        </>
    
    </main>
    
  )
}

export default ConnectClosetForm