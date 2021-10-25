import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "@firebase/firestore"
import { BookmarkAltIcon, ChatIcon, DotsCircleHorizontalIcon, EmojiHappyIcon, HeartIcon, PaperAirplaneIcon } from "@heroicons/react/outline"

import { HeartIcon as HearIconFilled } from "@heroicons/react/solid"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react"
import Moment from 'react-moment';
import { db } from "../../../../firebase"

function Post({id, username, userImg, img, caption}) {
    const { data: session } = useSession()
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);


    useEffect(()=>
        onSnapshot(
            query(
                collection(db, 'posts', id, 'comments'),
                orderBy('timestamp', 'desc')), 
                (snapshot)=>setComments(snapshot.docs)
        ),[db])

        useEffect(
            () =>
              onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) =>
                setLikes(snapshot.docs)
              ),
            [db, id]
          );
        
          useEffect(() => {
            setHasLiked(
              likes.findIndex((like) => like.id === session?.user?.uid) !== -1
            );
          }, [likes]);


    const sendComment = async (e) => {
        e.preventDefault();

        const commentToSend = comment;
        setComment('');


        //adding comment to backend posts collection
        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            username:session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp(),
        })
    }

    const likePost = async () => {
        if (hasLiked) {
          await deleteDoc(doc(db, 'posts', id, 'likes', session.user?.uid));
        } else {
          await setDoc(doc(db, 'posts', id, 'likes', session.user?.uid), {
            username: session.user?.username,
          });
        }
      };


    return (
        <div className="bg-white my-7 border rounded-sm">

            {/*HEader*/}
            <div className="flex items-center p-5">
                
                <img src={userImg} alt=""
                className="rounded-full h-12 w-12 object-contain border p-1 mr-3"/>
                
                <p className="flex-1 font-bold">{username}</p>
           
                <DotsCircleHorizontalIcon className="h-5"/>
           
            </div>
            

            {/*img*/}
            <img className="object-cover w-full" src={img} alt=""/>
            
            {/*Buttons*/}
            {session && (
                
                <div className="flex justify-between px-4 pt-4">
                    <div className="flex items-center space-x-4">
                        <div className='flex flex-col'>
                            {hasLiked ? (
                                <HearIconFilled
                                className='btn !text-red-600'
                                onClick={likePost}
                                />
                            ) : (
                                <HeartIcon className='btn' onClick={likePost} />
                            )}
                            {likes.length > 0 && (
                                <p className='font-bold'>{likes.length} likes</p>
                            )}
                        </div>
                        <ChatIcon className="btn"/>
                        <PaperAirplaneIcon className="btn"/>
                    </div>

                    <BookmarkAltIcon className="btn"/>
                
                </div>
        
            )}
            

            {/*caption*/}
            <p className="p-5 truncate"><span className="font-bold mr-1">{username}</span>{caption}</p>


            {/*Comments*/}
            {comments.length > 0 && (
                <div className='ml-10 mt-4 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                    {comments.map((comment) => (
                        <div
                        key={comment.data().id}
                        className='flex items-center truncate mb-3 space-x-2'
                        >
                        {comment.data().userImage ? (
                            <img
                            src={comment.data().userImage}
                            alt='User comment image'
                            className='h-7 rounded-full'
                            />
                        ) : (
                            <span className='h-7 w-7 rounded-full bg-gray-600 text-white text-center'>
                            {comment.data().username[0].toUpperCase()}
                            </span>
                        )}

                        <p className='text-sm flex-1'>
                            <span className='font-bold mr-2'>{comment.data().username}</span>
                            {comment.data().comment}
                        </p>
                        <Moment fromNow className='pr-5 text-xs text-gray-400'>
                            {comment.data().timestamp?.toDate()}
                        </Moment>
                        </div>
                    ))}
                </div>
      )}


            {/*input box*/}
            {session && (
                <form className="flex items-center p-4">
                    <EmojiHappyIcon className="h-7"/>
                    <input className="flex-1 border-none focus:ring-0 outline-none"
                    type="text"
                    placeholder="Add a Comment..."
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    
                    />
                    <button 
                    type='submit'
                    onClick={sendComment}
                    disabled={!comment.trim()} 
                    className="font-semibold text-blue-400">
                    Post
                    </button>
                </form>
            )}
            
        </div>
    )
}

export default Post
