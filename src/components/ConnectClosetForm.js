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
const ConnectClosetForm = () => {
    const [closetName,setClosetName] = useState('');
    const [closetPassword,setClosetPassword] = useState('');
    const [closetCountry,setClosetCountry] = useState('');
    const [closetNameCheck,setClosetNameCheck] = useState('');
    const [closetPasswordCheck,setClosetPasswordCheck] = useState('');

    const [closetImage,setClosetImage] = useState('');
    const [closetUsername,setClosetUsername] = useState('');
    const [closetCookies,setClosetCookies] = useState('');
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
        let dynamicCase ='closet_check'
        let closetCheckResponse = await checkCloset(dynamicCase,closetName,userId);
       
        if(closetCheckResponse.message === 'closet linked')
        {
            setLinkedClosetCheck(true);
            return
        }
        if(closetCheckResponse.message[0] && typeof (closetCheckResponse.message[0]) == 'object')
        {
            setClosetCookies(closetCheckResponse.message[0].cookies);
            setClosetUsername(closetCheckResponse.message[0].closetname);
            setClosetImage(closetCheckResponse.message[0].closet_img);
    
            localStorage.setItem('closetCookies', closetCheckResponse.message[0].cookies);
            localStorage.setItem("closetUsername", closetCheckResponse.message[0].closetname);
            localStorage.setItem("closetImage", closetCheckResponse.message[0].closet_img);
            setConnectionBox(false);
            setClosetStatus(true);
            return
        }
        if(closetCheckResponse.message == 'allow')
        {
            setLoading(true);
            setConnectionBox(false);
         
            let response =  await connectCloset(closetName,closetPassword);
            setClosetCookies(response.cookies);
            setClosetUsername(response?.ui?.dh);
            setClosetImage(response?.ui?.uit);
    
            localStorage.setItem('closetCookies', response?.cookie);
            localStorage.setItem("closetUsername", response?.ui?.dh);
            localStorage.setItem("closetImage", response?.ui?.uit);

            dynamicCase = 'poshmark';
            let uid_ = response?.ui?.uid;
            let closetName_ = response?.ui?.dh;
            let country_ = closetCountry;
            let closetImage_ = response?.ui?.uit
            let cookie_ = response?.cookie

            let closetAdd = await addCloset(dynamicCase,userId,closetName,closetName_,country_,closetImage_,cookie_)
            console.log('closetAdd :',closetAdd);
            setClosetStatus(true);
            setLoading(false);
        }
       
    }

    async function logoutCloset(){
        localStorage.removeItem('closetCookies');
        localStorage.removeItem("closetUsername");
        localStorage.removeItem("closetImage");
        setClosetStatus(false);
    }

    useEffect(()=>{
        let cookie = localStorage.getItem('closetCookies');
        let username = localStorage.getItem('closetUsername');
        let image = localStorage.getItem('closetImage');
        if(cookie !== null && username !== null && image !== null)
        {
            setClosetCookies(cookie);
            setClosetUsername(username);
            setClosetImage(image);
            setClosetStatus(true);
        }
    },[])

  return (
    <main className='flex flex-col gap-4'>
    
    <div className='flex items-center justify-between'>
        <div>
            {
                loading ?
                <p className='font-semibold text-lg'>Connecting closet</p>
                :
                <p className='font-semibold text-lg'>{closetStatus ? "Connected" : 'Connect closet'}</p>

            }
        </div>      
        <div>
            {
                closetStatus ?
                <Button variant="outline" onClick={()=>{logoutCloset()}}>logout</Button>
                :
                <Button disabled={loading} variant="outline" onClick={()=>{setConnectionBox(!connectionBox)}}>{connectionBox ? 'Back' : 'Connect'}</Button>
            }
        </div>
    </div>

    {
        connectionBox &&
        <div className='flex flex-row items-end justify-between gap-4 bg-white rounded lg p-4'>
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
                    inline
                    label="us"
                    value={'us'}
                    name="country"
                    type={'radio'}
                    onChange={(e)=>{setClosetCountry(e.target.value)}}
                    />
                    <Form.Check
                        inline
                        label="ca"
                        value={'ca'}
                        name="country"
                        type={'radio'}
                        onChange={(e)=>{setClosetCountry(e.target.value)}}
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
                    <Skeleton className="h-12 w-12 rounded-full" />  
                    <Skeleton className="h-4 w-52"/> 
                </div>
            
            </div>
    }
    {
        closetStatus &&
        <>
            <div className='flex flex-col justify-center items-start bg-white rounded-lg border py-4 px-4'>
                <div className='flex flex-col justify-center items-center border-b w-full gap-2 pb-2'>
                    <Avatar>
                        <AvatarImage src={closetImage}  />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>   
                    <div className='text-center'>
                        <p className='font-semibold'>
                           {closetUsername}
                        </p>
                    </div>   
                </div>
            

                <div className='d-flex flex-row items-center  gap-4 pt-3 w-full'>
                    
                    <p className={`font-semibold cursor-pointer ${tab === 'items' ? 'text-sky-400 border-b border-sky-400' : ''}`} onClick={()=>{setTab("items")}}>
                        Items
                    </p>
                    <p className={`font-semibold cursor-pointer ${tab === 'followers' ? 'text-sky-400 border-b border-sky-400' : ''}`} onClick={()=>{setTab("followers")}}>
                        Followers
                    </p>
                    <p className={`font-semibold cursor-pointer ${tab === 'following' ? 'text-sky-400 border-b border-sky-400' : ''}`} onClick={()=>{setTab("following")}}>
                        Following
                    </p>
                </div> 

            
            </div>
            <div>
                    {
                        tab === 'items' && 
                        <div className='w-full py-3 bg-white rounded-lg'>
                            <ClosetItems closetCookies={closetCookies} closetUsername={closetUsername}/>
                        </div>
                    }
                    {
                        tab === 'followers' && 
                        <div className='w-full py-3 bg-white rounded-lg'>
                            <ClosetFollowers closetCookies={closetCookies} closetUsername={closetUsername}/>
                        </div>
                    }
                    {
                        tab === 'following' && 
                        <div className='w-full py-3 bg-white rounded-lg'>
                            <ClosetFollowing closetCookies={closetCookies} closetUsername={closetUsername}/>
                        </div>
                    }
            </div>
        </>
       
    }
    
    </main>
    
  )
}

export default ConnectClosetForm