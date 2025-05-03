import { useState } from 'react';
import styles from './editModal.module.css'
import { Button } from '../../button'
import { Input } from '../../input';
import { db } from '../../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore';

interface EditModalProps {
    onCancel: () => void;
    editTitle: string;
    editContent: string;
    idPost: string;
}

export function EditModal({ onCancel, editTitle, editContent, idPost }: EditModalProps){
    const [title, setTitle] = useState(editTitle);
    const [content, setContent] = useState(editContent);

    async function handleEdit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        
        const docRef = doc(db, "posts", idPost)

        await updateDoc(docRef, {
            title,
            content
        })
        .then(() => {
            onCancel();
        })
    }

    return(
        <section className={styles.container} onClick={(e) => e.stopPropagation()}>
            <h2>Edit item</h2>

            <form className={`${styles.form}`} onSubmit={handleEdit}>
                <label htmlFor="title">Title</label>
                <Input 
                    type='text' 
                    id='title' 
                    placeholder='Hello world'
                    value={title}
                    setValue={setTitle}    
                />

                <label htmlFor="content">Content</label>
                <textarea 
                    id='content' 
                    placeholder='Content here'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.txtarea} 
                >
                </textarea>

                <div className={styles.buttons}>
                    <Button color="cancel" handleClick={onCancel}>
                        Cancel
                    </Button>
                    <Button  color="green" type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </section>
    )
}