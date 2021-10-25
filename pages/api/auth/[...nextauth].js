import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import MiniProfile from "../../../components/Feed/FeedComponents/MiniProfile/MiniProfile";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  //code to get by default login page from auth
  // theme:{
  //   logo: "http://links.papareact.com/sq0",
  //   brandColor: "#F13287",
  //   colorScheme: "auto"
  // }

  pages:{
    signIn: '/auth/signin',
  },
  callbacks:{
    async session({session, token, user}){
      session.user.username = session.user.name
      .split(' ')
      .join("")
      .toLocaleLowerCase();MiniProfile

      //Muhammad Muneeb Waseem = muhammadmuneebwaseem

      session.user.uid = token.sub;
      return session;

    }
  }
})