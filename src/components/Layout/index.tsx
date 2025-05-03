import { Header } from '../header'
import styles from './layout.module.css'

interface LayoutProps{
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps){
    return(
        <>
            <div>
                <Header/>
                <main className={styles.container}>
                    {children}
                </main>
            </div>
        </>
    )
}