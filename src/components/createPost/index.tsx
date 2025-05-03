import styles from './createPost.module.css'
import animate from '../../utils/styles/spinAnimation.module.css'
import { Button } from "../button"
import { ChangeEvent, useState } from "react"
import { Input } from "../../components/input"
import { db } from "../../services/firebaseConnection"
import { collection, addDoc } from "firebase/firestore"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { TbUpload, TbLoader } from "react-icons/tb";
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function CreatePost(){
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate()

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isBoxOpened, setIsBoxOpened] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(false);

    const hasEmptyFields = !title || !content;

    async function handleCreatePost(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        if (!user.uid) {
            navigate('/signin')
            return;
        }

        setLoading(true);

        if (!title || !content){
            toast.error("Fill Title and Content fields")
            return;
        }

        if (!user.uid || !user.username) return

        let uploadedImgUrl = "";

        if (image) {
            uploadedImgUrl = await handleUpload() || "";
        }

        try {
            await addDoc(collection(db, "posts"), {
                user: {
                    uid: user.uid,
                    username: user.username,
                    email: user.email
                },
                title: title,
                content: content,
                img_url: uploadedImgUrl || null,
                createdAt: new Date(),
            })

            setTitle("")
            setContent("")
            setPreviewImage("")
            setLoading(false);
            navigate(0);
            toast.success("Successfully created!")
        } catch (err) {
            toast.error("Could not create post. Try again later")
            setLoading(false);
        }
    }

    async function handleUpload(){
        const formData = new FormData();
        if(image){
            formData.append('file', image);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                })
                
                const data = await response.json();
                return data.secure_url;
            } catch (err) {
                console.log("Error uploading file");   
            }
        }
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
        if (e.target.files) {
            const img = e.target.files[0];
            
            if (img?.type !== "image/png" && img?.type !== "image/jpeg"){
                toast("Upload an image in PNG/JPEG format.", {
                    icon: '🖼️'
                })
                return
            }

            setImage(img);
            setPreviewImage(URL.createObjectURL(img))
        }
    }

    return(
        <section className={styles['new-post-box']}>
            <div className={styles['initial-box']}>
                <h2>What's on your mind?</h2>
                {!isBoxOpened && (
                    <Button disable={false} color="blue" handleClick={() => setIsBoxOpened(true)}>
                        New post
                    </Button>
                )}
            </div>

            <form 
                onSubmit={(e) => handleCreatePost(e)}
                className={`${styles.form} ${isBoxOpened ? styles.open : ''}`}
            >
                <label htmlFor="title">Title</label>
                <Input 
                    id="title" 
                    placeholder="Hello world" 
                    type="text"
                    value={title}
                    setValue={setTitle}
                />

                <label htmlFor="cont">Content</label>
                <textarea 
                    id="cont" 
                    placeholder="Content here" 
                    className={styles.txtarea}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                >
                </textarea>

                <label>Select an image (optional)</label>
                <label className={styles.upload}>
                    <TbUpload/>

                    <input
                        type="file"
                        accept="image/*"
                        className={styles.imgInput}
                        onChange={handleFile}
                    />

                    {previewImage && (
                        <img src={previewImage} alt="Preview image" />
                    )}

                </label>

                <div className={styles.buttons}>
                    <Button disable={false} color="cancel" handleClick={() => setIsBoxOpened(false)}>
                        Cancel
                    </Button>
                    <Button color="blue" disable={hasEmptyFields} type="submit">
                        {loading ? <TbLoader className={animate.loader} /> : 'Create'}
                    </Button>
                </div>
            </form>
        </section>
    )
}