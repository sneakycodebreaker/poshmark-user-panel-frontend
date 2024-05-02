
import "./globals.css";
import Header from "@/components/Header";
export const metadata = {
  title: "Poshmark User-Panel",
  description: "Generated by create next app",
};
import { StoreProvider } from "./storeProvider";
import { ClerkProvider} from '@clerk/nextjs'

export  default async function RootLayout({ children }) {
 
    
  return (
    <ClerkProvider>
    <StoreProvider>
      <html lang="en">     
          <body className='min-h-screen flex flex-col '>    
            <header className="border-b">
              <Header/>
            </header>
            <div className="bg-[#F4F2ED] flex-1 w-full ">
              <main className="max-w-6xl mx-auto">{children}</main>
            
            </div>  
            </body>     
      </html>
      </StoreProvider>
      </ClerkProvider>
  );
}
