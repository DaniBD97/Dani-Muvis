import React from 'react'
import AuthScreen from '../components/AuthBar'
import { useAuthStore } from '../store/authUser'
import BgScreen from '../components/BgScreen';
import GetTrendingContent from '../hook/GetTrendingContent';

const Home = () => {
  const { user } = useAuthStore();
 

  return (
    <div>
      {!user ? <>
        <BgScreen />
        <AuthScreen />
      </>
        :
        <article>

          <BgScreen />


        </article>
      }
    </div>
  )
}

export default Home