'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
import CustomSidebar from '@/components/SideBar';
import BottomBar from '@/components/BottomBar';
import { useIsMobile } from '@/hooks/use-mobile';
import LeaderboardMobile from '@/components/LeaderPageMobile';


function create({leaders}) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [isuplaoding, setIsUploading] = useState(false);
  const [headers, setHeaders] = useState({});
  const isMobile = useIsMobile();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  useEffect(() => {
    // Check if we are running on the client side
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

  

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedFormData = {
        Title: title,
        Caption: caption,
      }
      if (image) {

        setIsUploading(true);
        const data = new FormData();
        console.log(image.type);
        if(image.type!=='image/gif'&&image.type!=='image/jpeg'&&image.type!=='image/png'&&image.type!=='image/jpg'){
          toast.error('Only GIF, png, jpeg, jpg images are allowed')
          setIsUploading(false);
          return; 
        }
        data.append("file", image);
        data.append("upload_preset", "trials");
        const res = await axios.post("https://api.cloudinary.com/v1_1/dcscznqix/image/upload", data);
        updatedFormData.Image = res.data.secure_url;
        setIsUploading(false);
      }


      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        ...updatedFormData
      }, {
        headers: headers
      }).then((response) => {
        toast.success('Meme uploaded successfully')
        window.location.href = '/';
        setCaption('');
        setImage(null);
        setTitle('');
      }).catch((error) => {
        console.log('Error uploading meme:', error);
      });
    }
    catch (err) {
      console.log(err)
    }

  }
  return (
    <div className="flex bg-black">
      {!isMobile && <CustomSidebar />}
      {isuplaoding ? <div className="mx-auto md:mr-20 min-[840px]:mr-32 lg:mx-auto flex items-center justify-center min-h-screen bg-black">4
        <div className="p-8 rounded-lg  w-full max-w-md">
          <h1 className="text-4xl font-sans font-extrabold mb-4 text-center text-purple-400">Uploading Meme</h1>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div> :

        <div className=" flex items-center mx-auto md:mr-20 min-[840px]:mr-32 lg:mx-auto justify-center min-h-screen bg-black">
          <div className="p-8 rounded-lg  w-full max-w-md ">
            <h1 className="text-4xl font-sans font-extrabold mb-4 text-center text-purple-400">Upload Meme Here</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white">Title</label>
                <input
                  type="text"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Caption</label>
                <textarea
                  type="text"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-400 hover:to-purple-600"
              >
                Upload Meme
              </button>
            </form>
          </div>
        </div>}
      {isMobile && (

              <>
                <BottomBar showLeaderboard={showLeaderboard} setShowLeaderboard={setShowLeaderboard} />
              </>
            )}
    </div>
  );
}

export default create;