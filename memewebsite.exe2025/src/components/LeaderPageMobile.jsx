'use client'
import BottomBar from '@/components/BottomBar';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}

export default function LeaderboardMobile({ leaders, handleOnClick ,onclose}) {

  const isMobile = useIsMobile();
  const [showLeaderboard, setShowLeaderboard] = useState(false);




  return (
    <div className=" p-4 rounded-lg bg-black backdrop-blur-lg h-full  lg:w-1/4 min-[1160px]:block  right-0 overflow-y-auto scrollbar-thin no-scrollbar">
      <button onClick={onclose} className="absolute top-4 right-4 z-[100] text-white">
        Close
      </button>
      <h2 className="font-extrabold  m-2 text-purple-400"> 🏆 Leaderboard</h2>
      <ul>
        {leaders.map((leader, i) => (
          <li key={i} onClick={() => { handleOnClick(leader._id)
            onclose()
           }} className=" rounded-lg border border-gray-900 m-2 px-5 py-2 flex justify-between items-center text-white">
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
              {leader.Upvotes == 1 ? " Upvote" : " Upvotes"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}