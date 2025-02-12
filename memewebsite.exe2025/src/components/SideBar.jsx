import React, { use } from 'react';
import Link from 'next/link';
import { Home, Inbox, Settings, LogOut, UserPlus, BarChart2, User, Plus, Route, Router } from 'lucide-react'; // Adjust the import based on your actual icon library

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create",
    url: "/create",
    icon: Plus,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];
const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/sign-in';
}

export default function CustomSidebar() {
  return (
    <div className="h-screen fixed md:w-1/4 lg:w-1/5 xl:w-1/6  py-7 bg-black text-white flex flex-col items-center justify-between border-r border-gray-800">
      <div className="flex items-center justify-center h-16 bg-black">
        <img src="/exe.png" alt="Logo" className="h-10" />
        <h1 className='text-xl ml-3 font-bold text-white'>
           Meme NITH
        </h1>
      </div>
      <nav className="flex flex-col  h-fit py-4">
        <ul>
          {items.map((item) => (
            <li key={item.title} className=" 
             mb-8">
              <Link href={item.url} legacyBehavior>
                <a className="flex  justify-center p-2 rounded hover:bg-gray-700">
                  <item.icon className="mr-2" />
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      

      <button onClick={handleLogout} className="flex  justify-center p-2 w-fit rounded hover:bg-gray-700">
          <LogOut className="mr-2" />
            Log Out
          </button>
      </div>
         
    
  );
}