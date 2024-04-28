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
import { fetchItem } from '@/services/fetchItems'
import { Skeleton } from "@/components/ui/skeleton"
const ClosetItems = ({closetCookies,closetUsername}) => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async() => {
       setLoading(true)
       let response =  await fetchItem(closetCookies,closetUsername);
       setItems(response?.items);
       setLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, []);
  return (
    <div className='m-4 px-2'>
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
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
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
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
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
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
                            </TableCell>
                            <TableCell className='p-2'>
                                <Skeleton className="h-4"/>
                            </TableCell>
                        </TableRow>
                    </>
                    :
                    <>
                     {
                            items?.map((item) => (
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
                }                   
            </TableBody>
        </Table>

    </div>
  )
}

export default ClosetItems