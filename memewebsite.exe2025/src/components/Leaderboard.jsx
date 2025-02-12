'use client'
import BottomBar from '@/components/BottomBar';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LeaderPageMobile from './LeaderPageMobile';
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
  }
  return str;
}

export default function Leaderboard({ leaders ,handleOnClick}) {
  
  const isMobile = useIsMobile();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  
  

  return (
    <div className="bg-black fixed p-4 backdrop-blur-lg h-full  lg:w-1/4  right-0 overflow-y-auto scrollbar-thin no-scrollbar"> 
      <h2 className="font-bold  m-2 text-white">Leaderboard</h2>
      <ul>
        {leaders.map((leader, i) => (
          <li key={i} onClick={()=>{handleOnClick(leader._id)}} className=" rounded-lg border border-gray-900 m-2 px-5 py-2 flex justify-between items-center text-white">
            <div className="flex flex-col">

            <p className="font-bold text-xl">
              <span className="text-[#c084fc]">#</span>{leader.position} 
              </p>
              <span className="text-gray-400 text-md mt-1 ">
              {truncateString(leader.Title, 15)}

              </span>
            </div>
              <span className="text-gray-400 text-xs mt-1 ">
              

               <span className="text-white"> 
                {leader.Upvotes}
                </span>
                 {leader.Upvotes==1?" Upvote":" Upvotes"}
              </span>
          </li>
        ))}
      </ul>
      {isMobile && (
        <>
          <BottomBar showLeaderboard={showLeaderboard} setShowLeaderboard={setShowLeaderboard} />
          {showLeaderboard && (
            <div className="fixed inset-0 bg-black  z-50 p-4">
              <button onClick={() => setShowLeaderboard(false)} className="absolute top-4 right-4 text-white">
                Close
              </button>
              <LeaderPageMobile leaders={leaders} />
            </div>
          )}
        </>
      )}
    </div>
  );
}