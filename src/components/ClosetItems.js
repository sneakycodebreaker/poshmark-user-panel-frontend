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
import { PaginationSection } from './Paganation';
const ClosetItems = ({closetCookies,closetUsername}) => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30); 
    const fetchData = async() => {
       setLoading(true)
       let response =  await fetchItem(closetCookies,closetUsername);
       setItems(response?.items);
       setLoading(false);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = items.slice(indexOfFirstItem, indexOfLastItem);
    useEffect(() => {
        fetchData()
    }, []);
  return (
    <div className='m-4 px-2 flex flex-col gap-3'>
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
                     {[1, 2, 3].map((key) => (
                         <TableRow key={key}>
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
                    ))}
                        
                    </>
                    :
                    <>
                     {
                            currentUsers?.map((item) => (
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
        {
                loading === false ?
                <PaginationSection
                totalUsers={items.length}
                usersPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                />
                :
                ''
            }
    </div>
  )
}

export default ClosetItems