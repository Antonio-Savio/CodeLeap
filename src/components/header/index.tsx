import Logo from '../../assets/logo.png'
import styles from './header.module.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { useNavigate } from 'react-router-dom'

export function Header(){
    const user = useSelector((state: RootState) => state.user)
    const navigate = useNavigate();

    async function signout(){
        await signOut(auth)
        navigate('/signin')
    }

    return(
        <header className={styles.header}>
            <h1>
                <Link to='/'>
                    <img src={Logo} alt="CodeLeap logo" />
                    Network
                </Link>
            </h1>

            {!user.email ? (
                <Link to='/signin'>Sign in</Link>
            ) : (
                <nav className={styles.nav}>
                    <Link to='/myposts'>My Posts</Link>

                    <button onClick={signout} className={styles.signout}>
                        Sign out
                    </button>
                </nav>
            )}
        </header>
    )
}