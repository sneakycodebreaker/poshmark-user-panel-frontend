'use client'
import { Button } from "@/components/ui/button";
import { Home, ScrollText, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useUser } from "@clerk/nextjs";
import { addUser } from "@/services/addUser";
function Header() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [tab, setTab] = useState('');
    const router = useRouter();
   
    const loginFunction = async(user) => {
        localStorage.setItem('userId', user?.id)    
        let dynamicCase = 'user';
        let username = user?.fullName;
        let email = user?.emailAddresses[0]?.emailAddress;
        await addUser(dynamicCase,username,email);  
    };

    const logoutFunction = () => {
        setSessionStatus('');
        localStorage.removeItem('status');
        router.push('/');
       
    };

  
    useEffect(() => {
        const path = window.location.pathname.replace("/",'');
        if(path != 'home' && path != '') 
        {
            setTab(path)
        } 

        if(user)
        {
            loginFunction(user)
            console.log("User :",user);
            console.log("User :",user.provider);
        }
      
    }, [user]);

    const renderTabLink = (href, Icon, text, tabName) => (
        <Link href={href} passHref
            className={`icon hidden md:flex`}
            onClick={() => setTab(tabName)}
        >  
                <Icon className={`h-5 ${tab === tabName ? 'stroke-gray-500 fill-white' : 'fill-white stroke-gray-300'}`} />
                <p className={`${tab === tabName ? 'text-gray-500 font-semibold' : 'text-gray-400 text-sm'}`}>{text}</p>     
        </Link>
    );

    return (
        <div className="flex items-center justify-between p-2 max-w-6xl mx-auto ">
            <SignedIn>
                <div className="flex space-x-4 px-6">
                    {/* {renderTabLink('/home', Home, 'Home', 'home')} */}
                    {renderTabLink('/account', User, 'Account', 'account')}
                    {renderTabLink('/logs', ScrollText, 'Logs', 'logs')}
                    {renderTabLink('/settings', Settings, 'Settings', 'settings')}
                </div>
                <SignedIn>
                    <UserButton showName={true} appearance={"w-20 h-20"}/>
                </SignedIn>
            </SignedIn>

            <SignedOut>
                <img
                    className="w-36 h-7"
                    src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/logo-poshmark-magenta@2x-817f6e64db4f84be0421a7e07ca9a86c1c88fd3e7dfa5ef7f9e4231ddd0fdc99.png"
                />

                <SignedOut>
                    <Button asChild variant='outline'>
                        <SignInButton />
                    </Button>
                </SignedOut>

            </SignedOut>
            {/* {sessionStatus === '' ? (
                <>
                <img
                className="w-36 h-7"
                src="https://d2gjrq7hs8he14.cloudfront.net/webpack4/logo-poshmark-magenta@2x-817f6e64db4f84be0421a7e07ca9a86c1c88fd3e7dfa5ef7f9e4231ddd0fdc99.png"
                />
                <Button variant="outline" onClick={loginFunction}>Login</Button>

                </>
            ) : (
                <>
                    <div className="flex space-x-4 px-6">
                        {renderTabLink('/home', Home, 'Home', 'home')}
                        {renderTabLink('/account', User, 'Account', 'account')}
                        {renderTabLink('/logs', ScrollText, 'Logs', 'logs')}
                        {renderTabLink('/settings', Settings, 'Settings', 'settings')}
                    </div>
                    <div className="flex items-center space-x-4 px-6">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        
                        <SignedOut>
                            <Button asChild>
                                <SignInButton />
                            </Button>
                        </SignedOut>
                    </div>
                </>
            )} */}
        </div>
    );
}

export default Header;