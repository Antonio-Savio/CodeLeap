import { useState } from 'react';
import styles from './editModal.module.css'
import animate from '../../../utils/styles/spinAnimation.module.css'
import { Button } from '../../button'
import { Input } from '../../input';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updatePost } from '../../../store/postSlice'
import { TbLoader } from 'react-icons/tb';

interface EditModalProps {
    onCancel: () => void;
    editTitle: string;
    editContent: string;
    idPost: string;
}

export function EditModal({ onCancel, editTitle, editContent, idPost }: EditModalProps){
    const dispatch = useDispatch();
    const [title, setTitle] = useState(editTitle);
    const [content, setContent] = useState(editContent);
    const [loading, setLoading] = useState(false);

    async function handleEdit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);

        if (!title || !content) return;

        try {
            await api.patch(`/${idPost}/`, {
                title,
                content
            });

            onCancel();
            dispatch(updatePost({
                id: idPost,
                title,
                content
            }))
            toast.success("Post updatated!");
        } catch (err) {
            toast.success("Error updatating post");
        } finally {
            setLoading(false);
        }
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
                        {loading ? <TbLoader className={animate.loader} /> : 'Save'}
                    </Button>
                </div>
            </form>
        </section>
    )
}