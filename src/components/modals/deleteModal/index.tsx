import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../../button'
import styles from './deleteModal.module.css'
import animate from '../../../utils/styles/spinAnimation.module.css'
import { db } from '../../../services/firebaseConnection';
import toast from 'react-hot-toast';
import { api } from '../../../services/api';
import { useDispatch } from 'react-redux';
import { removePost } from '../../../store/postSlice'
import { TbLoader } from "react-icons/tb"

interface DeleteModalProps {
    onCancel: () => void;
    postId: string;
    docId: string;
}

export function DeleteModal({ onCancel, postId, docId }: DeleteModalProps){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    async function handleDeletePost(){
        setLoading(true);
        const docRef = doc(db, "posts", docId);

        try {
            await api.delete(`/${postId}/`);

            await deleteDoc(docRef);

            dispatch(removePost(postId));
            toast.success("Post successfully deleted!");
            onCancel();
            
        } catch(err) {
            console.log(err);
            toast.error("Error deleting post")
        } finally {
            setLoading(false);
        }
    }

    return(
        <section className={styles.container} onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure you want to delete this item?</h2>

            <div className={styles.buttons}>
                <Button color="cancel" handleClick={onCancel}>
                    Cancel
                </Button>
                <Button  color="red" handleClick={handleDeletePost}>
                    {loading ? <TbLoader className={animate.loader} /> : 'Delete'}
                </Button>
            </div>
        </section>
    )
}