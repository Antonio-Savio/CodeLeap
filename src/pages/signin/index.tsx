import { FormEvent, useEffect, useState } from "react"
import styles from "./signin.module.css"
import animate from "../../utils/styles/spinAnimation.module.css"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { auth, db } from "../../services/firebaseConnection"
import { signInWithEmailAndPassword  } from "firebase/auth"
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import toast from "react-hot-toast"
import { TbLoader } from "react-icons/tb"

export function Signin() {
    const { uid } = useSelector((state: RootState) => state.user)
    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (uid){
            navigate('/')
        } else {
            const toastId = toast((t) => (
                <span style={{ display: "flex", gap: 10, flexDirection: 'column'}}>
                    <p>Quick start with <b>johndoe</b></p>
                    <div>
                        <button 
                            onClick={() => toast.dismiss(t.id)}
                            style={{ padding: "4px 12px", borderRadius: 4 }}
                        >
                            Dismiss
                        </button>
                        <button 
                            onClick={() => {
                                toast.dismiss(t.id)
                                setUsername("johndoe");
                                setPassword("johndoe");
                            }}
                            style={{
                                backgroundColor: "#22c55e",
                                color: "#fff",
                                border: "none",
                                padding: "4px 16px",
                                borderRadius: 4,
                                fontWeight: 'bold',
                                marginLeft: '8px'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </span>
            ), {
                duration: 10000,
                position: "bottom-center",
            })

            return () => toast.dismiss(toastId);
        }
    }, [uid])

    const hasEmptyFields = username === '' || password === '';

    async function handleSignin(e: FormEvent){
        e.preventDefault();
        setLoading(true);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length === 0) {
            alert("User not found.");
            return
        }

        const email = querySnapshot.docs[0].data().email;
        
        
        try {
            await signInWithEmailAndPassword(auth, email, password);

            setLoading(false);
            toast(`Welcome ${username}!`, {
                icon: '👋',
            })
            navigate('/', { replace: true })
        } catch(e){
            toast.error("There was an error on sign in")
            setLoading(false);
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.box}>
                <h1>Welcome to CodeLeap network!</h1>

                <form className={styles.form} onSubmit={(e) => handleSignin(e)}>
                    <label htmlFor="user">Please enter your username</label>
                    <Input 
                        type='text' 
                        id='user'
                        placeholder="Johndoe"
                        value={username}
                        setValue={setUsername}
                    />

                    <label htmlFor="password">Please enter your password</label>
                    <Input 
                        type="password" 
                        id='password' 
                        placeholder="******"
                        value={password}
                        setValue={setPassword}
                    />

                    <div className={styles.actions}>
                        <Link to="/signup">Not registered? Sign up.</Link>

                        <Button disable={hasEmptyFields} type="submit" color="blue">
                            {loading ? <TbLoader className={animate.loader} /> : 'ENTER'}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}