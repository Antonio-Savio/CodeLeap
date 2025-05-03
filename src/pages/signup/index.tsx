import { FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./signup.module.css"
import animate from "../../utils/styles/spinAnimation.module.css"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { auth, db } from "../../services/firebaseConnection"
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import toast from "react-hot-toast"
import { TbLoader } from "react-icons/tb"

export function Signup() {
    const navigate = useNavigate();
    const { uid } = useSelector((state: RootState) => state.user);

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (uid) {
            navigate('/')
        }
    }, [uid])

    const hasEmptyFields = !username || !email || !password;
    const isUsernameValid = /^[^\s]+$/.test(username);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    async function handleSignup(e: FormEvent){
        e.preventDefault();

        if (!isUsernameValid){
            toast.error("Username must not have empty spaces.")
            return
        }

        if (!isEmailValid){
            toast.error("Email is not valid")
            return
        }

        if (password.length < 6){
            toast.error("Password should be at least 6 characters");
            return;
        }
        setLoading(true)

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user.user, {
                displayName: username
            });

            await addDoc(collection(db, "users"), {
                username: username,
                email: email
            })

            setLoading(false)
            toast(`Welcome ${username}!`, {
                icon: '👋'
            })
            navigate('/', { replace: true });
        } catch (error) {
            toast.error("Unexpected error. Try again later.")
            setLoading(false)
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.box}>
                <h1>Create your CodeLeap account!</h1>

                <form className={styles.form} onSubmit={(e) => handleSignup(e)}>
                    <label htmlFor="user">Please enter your username</label>
                    <Input 
                        type='text' 
                        id='user'
                        placeholder="Johndoe"
                        value={username}
                        setValue={setUsername}
                    />

                    <label htmlFor="email">Please enter your email</label>
                    <Input 
                        type="email" 
                        id='email' 
                        placeholder="johndoe@codeleap.com"
                        value={email}
                        setValue={setEmail}
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
                        <Link to='/signin'>Already registered? Sign in.</Link>

                        <Button disable={hasEmptyFields} type="submit" color="blue" >
                            {loading ? <TbLoader className={animate.loader} /> : 'Register'}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}