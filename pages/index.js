import Head from 'next/head'
import Feed from '../components/Feed/Feed'
import Header from '../components/Header/Header'
import Modal from '../components/Modal/Modal'

export default function Home() {
  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-auto scrollbar-hide">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
      <Feed/>

      {/*Modal*/}
      <Modal/>

     
    </div>
  )
}
