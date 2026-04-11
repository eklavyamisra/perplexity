import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';

const DashboardPage = () => {
  const {user} = useSelector(state => state.auth)
  const chat = useChat();
  useEffect(() => {
    chat.socket
  }, [])
  
  console.log(user)
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage