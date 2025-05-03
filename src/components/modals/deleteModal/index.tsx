import { deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../../button'
import styles from './deleteModal.module.css'
import { db } from '../../../services/firebaseConnection';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DeleteModalProps {
    onCancel: () => void;
    idPost: string;
}

export function DeleteModal({ onCancel, idPost }: DeleteModalProps){
    const navigate = useNavigate()

    async function handleDeletePost(){
        const docRef = doc(db, "posts", idPost);

        await deleteDoc(docRef)
        .then(() => {
            toast.success("Post successfully deleted!");
            navigate(0)
        })
    }

    return(
        <section className={styles.container} onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure you want to delete this item?</h2>

            <div className={styles.buttons}>
                <Button color="cancel" handleClick={onCancel}>
                    Cancel
                </Button>
                <Button  color="red" handleClick={handleDeletePost}>
                    Delete
                </Button>
            </div>
        </section>
    )
}