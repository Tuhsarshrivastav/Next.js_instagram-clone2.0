import Post from "./Post"

import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
  } from '@firebase/firestore';

import { useEffect, useState } from 'react';
import { db } from '../../../../firebase';

function Posts() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsuscribe = onSnapshot(
          query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
          (snapshot) => {
            setPosts(snapshot.docs);
          }
        );
        return unsuscribe; // clean up
      }, [db]);

      console.log(posts)

    return (
        <div>
        {posts.map((post)=>(
            <Post
            key={post.id}
            username={post.data().username}
            userImg={post.data().profileImg}
            id={post.id}
            img={post.data().image}
            caption={post.data().caption}
            />
        ))}

            
        </div>
    )
}

export default Posts
