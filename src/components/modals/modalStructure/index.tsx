import { ReactNode } from 'react'
import styles from './modalStructure.module.css'

interface ModalStructureProps {
    onCancel: () => void;
    children : ReactNode
}

export function ModalStructure({ children, onCancel }: ModalStructureProps){
    return(
        <main className={styles.background}>
            <div className={styles.modalOverlay} onClick={onCancel}>
                {children}
            </div>
        </main>
    )
}