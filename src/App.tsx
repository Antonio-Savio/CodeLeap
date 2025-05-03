import { routes } from "./routes"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from './services/firebaseConnection'
import { useDispatch } from "react-redux"
import { setUser, clearUser } from "./store/userSlice"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        dispatch(setUser({
          uid: user.uid,
          username: user.displayName || '',
          email: user.email
        }))
      } else {
        dispatch(clearUser())
      }
    })

    return () => unsubscribe();
  }, [dispatch])

  return (
    <>
      {routes()}
    </>
  )
}

export default App
