
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Leaderboard from '../../components/Leaderboard';
import CustomSidebar from '@/components/SideBar';
import MemeSection from '../../components/MemeSection';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomBar from '@/components/BottomBar';
import toast from 'react-hot-toast';
import MemeByID from '@/components/MemeById';
import Image from 'next/image';
import LeaderboardMobile from '@/components/LeaderPageMobile';

export default function Page() {
  interface Meme {
    _id: string;
    Upvotes: string[];
    // Add other properties of Meme if needed
  }

  const [memes, setMemes] = useState<Meme[]>([]);
  const [User, setUser] = useState<string | null>(null);
  const [leaders, setLeaders] = useState([]);
  const isMobile = useIsMobile();
  const [headers, setHeaders] = useState({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const [sort, setSort] = useState('new');
  const [memeId, setMemeId] = useState('');
  const [loadingmorememes, setLoadingmorememes] = useState(false);

  console.log(isMobile);

  useEffect(() => {
    // Fetch data from the backend
    if (typeof window !== 'undefined') {
      setHeaders({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      })
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/auth`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }).then((response) => {
      console.log('User data:', response.data);

    }).catch((error) => {
      console.log('Error fetching user data:', error);
      localStorage.removeItem('token');
      window.location.href = '/sign-in';
    });

    fetchDataLeader();

    
    const user = localStorage.getItem('user');
    if (user) {
      setUser(user);
    }

  }, []);
  useEffect(() => {
    fetchData();
  }, [sort]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/get?limit=10&page=1&sort=${sort}`);
      setMemes(response.data.data);
      console.log(response.data.data);

    } catch (error) {
      console.log('Error fetching memes:', error);
    }
  }
  const fetchDataLeader = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/top/10`).then((response) => {
      console.log('Leaderboard data:', response.data);
      setLeaders(response.data.data);
    })
      .catch((error) => {
        console.log('Error fetching leaderboard:', error);
      });
  }

  interface CommentCallback {
    (): void;
  }

  const handleCommentSubmit = (id: string, comment: string, callback: CommentCallback) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/post/comment/${id}`, { Description: comment }, {
      headers: headers
    }).then(() => {
      toast.success('Comment added');
      fetchData();
      callback();
    }).catch((error) => {
      toast.error(error.response.data.error);
    });
  }
  const handleshowMeme = (id: string) => {
    setMemeId(id);
    setShowMeme(true);
    console.log('Meme ID:', id);
  }
  const handleLoadmore = async () => {
    try {
      setLoadingmorememes(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/get?limit=10&page=${memes.length / 10 + 1}&sort=${sort}`);
      if (response.data.data.length === 0) {
        toast.success('No more memes to show');
        setLoadingmorememes(false);
        return;
      }
      setMemes([...memes, ...response.data.data]);
      console.log(response.data.data);
      setLoadingmorememes(false);

    } catch (error) {
      console.log('Error fetching memes:', error);
    }
  }


  interface UpvoteCallback {
    (): void;
  }

  const handleUpvote = (id: string, upvoted: boolean, callback: UpvoteCallback = () => { }) => {
    setMemes(memes.map((meme) => {
      if (meme._id === id) {
        if (User && !meme.Upvotes.includes(User)) {
          meme.Upvotes.push(User);
        }
        else if (User && meme.Upvotes.includes(User)) {
          meme.Upvotes = meme.Upvotes.filter((upvoter) => upvoter !== User)
        }
      }
      return meme
    }));
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/post/upvote/${id}`, {}, {
      headers: headers
    }).then(() => {
      fetchDataLeader();
      handleLoadmore();
      callback();
    }).catch((error) => {
      toast.success(error.response.data.error);
    });
  }
  const handlechangefilter = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      e.preventDefault();
      setSort(e.target.value);
    }
    catch (error) {
      console.log('Error fetching memes:', error);
    }
  }
  return (
    <>    {isMobile &&
      <div className='bg-black fixed w-full'>

        <div className="bg-black flex justify-between text-white mx-2 md:mx-4 py-2 lg:mx-16">

          <Image src="/exe.png" alt="logo" width={25} height={25} />
          <h1 className="text-2xl text-center justify-center  text-purple-400   font-extrabold">MemeBuzz</h1>
          <div />
        </div>
      </div>
    }
      <div className="flex min-h-screen bg-black">
        {!isMobile && <CustomSidebar />}
        <div className="flex-1 mt-9 flex flex-col">

          <div className={`flex flex-col justify-center p-4 ${showMeme ? 'hidden' : ''}`}>
            <select
              value={sort}
              onChange={handlechangefilter}
              className="bg-purple-400 text-white p-2 rounded-md mb-4 w-1/6 mx-auto"
            >
              <option value="new">New</option>
              <option value="hot">Hot</option>
            </select>

            <MemeSection showmeme={showMeme} memes={memes} user={User} handleUpvote={handleUpvote} handleComment={handleCommentSubmit} />
            {memes.length !== 0 && <button onClick={handleLoadmore} disabled={loadingmorememes} className="bg-purple-400 px-auto  mb-16 text-white p-2 rounded-md">{loadingmorememes ? "Loading Memes" : "Load More"}</button>}
          </div>
          <div className={`flex-1 p-4 ${!showMeme ? 'hidden' : ''}`}>
            {<MemeByID isopen={showMeme} key={memeId} memeId={memeId} user={User} handleComment={handleCommentSubmit} handleUpvote={handleUpvote} onclose={() => setShowMeme(false)} />}

          </div>
        </div>
        {!isMobile && (

          <Leaderboard leaders={leaders} handleOnClick={handleshowMeme} />

        )}
        {isMobile && (
          <>
            <BottomBar showLeaderboard={showLeaderboard} setShowLeaderboard={setShowLeaderboard} />
            {showLeaderboard && (


              <div className="fixed inset-0 bg-black bg-opacity-75 z-50 p-4">
                <LeaderboardMobile leaders={leaders} handleOnClick={handleshowMeme} onclose={() => { setShowLeaderboard(!showLeaderboard) }} />

              </div>
            )}
          </>
        )}
      </div></>
  );
}
