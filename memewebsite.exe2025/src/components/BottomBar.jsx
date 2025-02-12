import React from 'react';
import Link from 'next/link';
import { Home, User, Plus, BarChart2 } from 'lucide-react'; // Adjust the import based on your actual icon library

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Create",
    url: "/create",
    icon: Plus,
  },
];

export default function BottomBar({ showLeaderboard, setShowLeaderboard }) {
  return (
    <div className="fixed bottom-0 w-full flex justify-around bg-[#c084fc] text-white p-2">
      {items.map((item) => (
        <Link key={item.title} href={item.url} legacyBehavior>
          <a className="flex items-center justify-center p-2 rounded hover:bg-gray-700">
            <item.icon className="w-6 h-6" />
          </a>
        </Link>
      ))}
      {window.location.pathname==='/' &&<button onClick={() => setShowLeaderboard(!showLeaderboard)}>
        <BarChart2 className="w-6 h-6" />
      </button>}
    </div>
  );
}