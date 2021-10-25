import { useSession } from "next-auth/react"
import MiniProfile from "./FeedComponents/MiniProfile/MiniProfile"
import Posts from "./FeedComponents/Posts/Posts"
import Stories from "./FeedComponents/Stories/Stories"
import Suggestions from "./FeedComponents/Suggestions/Suggestions"

function Feed() {
    const { data:session } = useSession()
    return (
        <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${!session && "grid-cols-1 max-w-3xl" }`}>


            {/*Section*/}

            <section className="col-span-2">
                {/*Stories*/}
                <Stories/>
                

                {/*Post*/}
                <Posts/>


            </section>
                

            {/*Section*/}

            {session && (
                <section className="hidden xl:inline-grid md:col-span-1">
                
                 <div className="fixed top-20">
                     {/*Mini Profile*/}
                     <MiniProfile/>
                     
                     {/*Suggestions*/}
                     <Suggestions/>
 
                 </div>
 
                </section>
            )}
           
                
            
        </main>
    )
}

export default Feed
