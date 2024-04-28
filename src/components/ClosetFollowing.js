'use client'
import {useState,useEffect} from 'react'
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
import { fetchFollowing } from '@/services/fetchFollowing';
import { Skeleton } from "@/components/ui/skeleton"
const ClosetFollowing = ({closetUsername,closetCookies}) => {
  const [Following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async() => {
     setLoading(true)
     let response =  await fetchFollowing(closetUsername,closetCookies);
     setFollowing(response.following.data);
     setLoading(false)
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <div className='m-4 px-2'>
        <Table >
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px] p-2">Image</TableHead>
                <TableHead className='p-2'>Username</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    loading === true ?
                    <>
                        <TableRow>
                            <TableCell className='p-2'>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </TableCell>
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='p-2'>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </TableCell>
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='p-2'>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </TableCell>
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
                            </TableCell>
                        </TableRow>
                    </>
                    :
                    <>
                     {
                            Following?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className='p-2'>
                                        <Image 
                                            src={user?.picture_url}
                                            alt="user image"
                                            width={48} 
                                            height={48} 
                                            className='rounded-full' 
                                        />
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <p>{user?.username}</p> 
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </>
                }
               
                      
            </TableBody>
        </Table>
    </div>
  )
}

export default ClosetFollowing