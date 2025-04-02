"use client"

import { SocketContextProvider } from "@/context/context";

function DashboardLayout(
    {
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>
) {

 
  return (
    
            <SocketContextProvider>
          {children}
          </SocketContextProvider>
     
  )
}

export default DashboardLayout