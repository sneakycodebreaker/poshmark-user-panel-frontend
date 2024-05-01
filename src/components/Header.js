'use client'
import { Button } from "@/components/ui/button";
import { Home, ScrollText, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { UserInformation } from "./UserInformation";
function Header() {
    const [tab, setTab] = useState('');
    const [sessionStatus, setSessionStatus] = useState('');
    const router = useRouter();

    const loginFunction = () => {
        setSessionStatus('login');
        localStorage.setItem('status', 'login');
        router.push('/home');
       
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
     
        const status = localStorage.getItem('status');
        setSessionStatus(status == null ? '' : status);
    }, []);

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
                    <Button asChild variant='secondary'>
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