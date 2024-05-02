'use client'
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
import { fetchFollowing } from '@/services/fetchFollowing';
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationSection } from './Paganation';
const ClosetFollowing = ({ closetUsername, closetCookies }) => {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(30); 

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchFollowing(closetUsername, closetCookies);
            setFollowing(response.following.data);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = following.slice(indexOfFirstUser, indexOfLastUser);

    useEffect(() => {
        fetchData();
    }, []);

 

    return (
        <div className='m-4 px-2 flex flex-col gap-3'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] p-2">Image</TableHead>
                        <TableHead className='p-2'>Username</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <>
                            {[1, 2, 3].map((key) => (
                                <TableRow key={key}>
                                    <TableCell className='p-2'>
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        <>
                            {currentUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className='p-2'>
                                        <Image
                                            src={user.picture_url}
                                            alt="user image"
                                            width={48}
                                            height={48}
                                            className='rounded-full'
                                        />
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <p>{user.username}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    )}

                </TableBody>
            </Table>
            {
                loading === false ?
                <PaginationSection
                totalUsers={following.length}
                usersPerPage={usersPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                />
                :
                ''
            }
           
           
        </div>
    );
};



export default ClosetFollowing;