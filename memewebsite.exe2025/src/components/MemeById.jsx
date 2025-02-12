"use client";
import React, { useEffect, useState } from 'react';
import Upvoteicon from '../../public/upvote.svg';
import Upvotedicon from '../../public/upvoted.svg';
import { Chat } from 'react-bootstrap-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'react-bootstrap-icons';
import { format } from 'date-fns';
import axios from 'axios';

function MemeByID({ isopen, memeId, user, handleUpvote, handleComment, onclose }) {

    const [isCommentModalOpen, setIsCommentModalOpen] = useState('');
    const [comment, setComment] = useState("");
    const [Comments, setComments] = useState([]);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [meme, setMeme] = useState(null);

    useEffect(() => {
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
        if (isopen) {
            fetchMeme(memeId);
        }
    }, [memeId, isopen]);

    const fetchMeme = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/get/${id}`);
            setMeme(response.data.data);
        } catch (error) {
            console.log('Error fetching meme:', error);
        }
    }

    const fetchComments = async (id) => {
        setIsCommentLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/comments/get/${id}`);
            setComments(response.data.data);
        } catch (error) {
            console.log('Error fetching comments:', error);
        }
        setIsCommentLoading(false);
    }
    console.log(meme);

    if (!meme || !isopen) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="p-4">
        
        <div key={meme._id} className="lg:max-w-xl md:max-w-md min-[1160px]:mx-auto md:ml-auto md:mr-20 min-[840px]:mr-32 max-w-sm mx-auto  shadow-md rounded-lg px-4 py-6 mb-4 border bg-black border-gray-800">
            <p className=' text-white mb-6 hover:underline cursor-pointer ' onClick={onclose}>&larr;  All Memes</p>
            <div className="flex items-center ">
                <img
                    src={meme.User.avatar}
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2 "
                />
                <span className="font-semibold text-white">{meme.User.name}</span>
            </div>
            <span className='text-gray-500 text-xs mb-5 ml-10'>{format(new Date(meme.createdAt), 'dd MMM yyyy')}</span>
            <h1 className="text-xl my-2 font-semibold text-white overflow-x-auto no-scrollbar">{meme.Title}</h1>
            {meme.Image ? (
                <img
                    src={meme.Image}
                    alt="Meme"
                    className="w-full h-auto mb-2"
                />
            ) : (
                <></>
            )}
            <p className="text-white my-3 overflow-x-auto no-scrollbar">{meme.Caption}</p>
            <div className="flex justify-start mt-8">
                <div className="md:w-1/6 w-1/2 flex flex-col justify-between md:justify-start items-center">
                    {!meme.Upvotes.includes(user) ? (
                        <Upvoteicon onClick={() => handleUpvote(meme._id, false,()=>{
                            fetchMeme(meme._id)
                        })} style={{ fill: "white", cursor: "pointer", width: 30, height: 30 }} />
                    ) : (
                        <Upvotedicon onClick={() => handleUpvote(meme._id, true,()=>{
                            fetchMeme(meme._id)
                        })} style={{ fill: "#c084fc", cursor: "pointer", width: 30, height: 30 }} />
                    )}
                    <span className="text-white text-xs mt-2">{meme.Upvotes.length} {meme.Upvotes.length === 1 ? "Upvote" : "Upvotes"}</span>
                </div>
                <div className="md:w-1/6 w-1/2 flex flex-col justify-between md:justify-start items-center">
                    <Chat onClick={() => {
                        setIsCommentModalOpen(meme._id)
                        fetchComments(meme._id)
                    }} style={{ fill: "white", cursor: "pointer", width: 30, height: 30 }} />
                    <span className="text-white text-xs mt-2">{meme.Comments.length} {meme.Comments.length === 1 ? "Comment" : "Comments"}</span>
                </div>
            </div>
            <AnimatePresence>
                {isCommentModalOpen == meme._id && (

                    <motion.div
                        initial={{ translateY: -50, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-black flex items-center justify-center flex-col mt-10"
                    >

                        <div className="flex justify-between items-center mb-4 w-full">
                            <h1 className="text-white font-bold">Comments</h1>
                            <X onClick={() => setIsCommentModalOpen(false)} style={{ fill: "white", cursor: "pointer" }} />
                        </div>
                        <div className="flex flex-col gap-2 max-h-44 no-scrollbar overflow-y-auto w-full">
                            {isCommentLoading ? <div className="text-white">Loading...</div>
                                : Comments.map(comment => (
                                    <div key={comment._id} className="border-gray-700 border p-2 rounded-lg flex items-center gap-2">
                                        <img
                                            src={comment.User.avatar}
                                            alt="User"
                                            className="w-8 h-8 rounded-full mr-2 "
                                        />
                                        <div className='flex flex-col'>
                                            <p className="text-white">{comment.User.name}</p>
                                            <p className="text-white">{comment.Description}</p>
                                        </div>
                                    </div>
                                ))}

                        </div>
                        <div className="flex justify-between items-center w-full mt-4">

                            <input type="text" value={comment} placeholder="Add a comment" className="bg-gray-800 text-white p-2 rounded-lg w-3/4" onChange={(e) => { setComment(e.target.value) }} />
                            <button onClick={() => {
                                handleComment(meme._id, comment, () => { fetchComments(meme._id) 
                                setComment('')
                                fetchMeme(meme._id)
                                })

                            }} className="bg-[#c084fc] text-white text-lg p-2 rounded-lg w-1/4 ml-2">Post</button>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
        </div>

    );
}

export default MemeByID;