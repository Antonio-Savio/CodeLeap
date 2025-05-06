import { useEffect, useState } from "react";
import { Button } from "../../button";
import styles from './commentModal.module.css'
import animate from '../../../utils/styles/spinAnimation.module.css'
import { RootState} from '../../../store/index'
import { useSelector } from "react-redux";
import { collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import toast from "react-hot-toast";
import { TbLoader } from "react-icons/tb";
import { TbTrashXFilled } from "react-icons/tb";
import { formatTime } from "../../../utils/time/formatTime";
import { PostsProps } from "../../../store/postSlice"

interface CommentModalProps {
    onCancel: () => void;
    data: PostsProps;
}

interface CommentProps{
    id: string;
    username: string;
    comment: string;
    commentedAt: Timestamp;
}

export function CommentModal({ onCancel, data }: CommentModalProps){
    const { uid, username } = useSelector((state: RootState) => state.user)
    
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState<CommentProps[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const commentsRef = collection(db, "posts", data.docId, "comments");
        const q = query(commentsRef, orderBy("commentedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snap) => {
            let list: CommentProps[] = [];

            snap.forEach( doc => {
                list.push({
                    id: doc.id,
                    username: doc.data().username,
                    comment: doc.data().comment,
                    commentedAt: doc.data().commentedAt 
                })
            })

            setCommentList(list)
        })

        return () => unsubscribe();
    }, [])

    async function handleComment(){
        if (!uid || !username) return;
        setLoading(true);

        const commentRef = doc(db, "posts", data.docId, "comments", uid);
        const postRef = doc(db, "posts", data.docId)

        try {
            await setDoc(commentRef, {
                username: username,
                comment: comment,
                commentedAt: new Date()
            })

            await updateDoc(postRef, {
                comments: increment(1)
            })

            setComment("")
            toast.success("Successfully commented!");
            setLoading(false);

        } catch(e){
            toast.error("Unexpected error. Try again later.")
            setLoading(false);
        }
    }

    async function handleDeleteComment() {
        if (!uid) return;
        const docRef = doc(db, "posts", data.docId, "comments", uid);
        
        await deleteDoc(docRef)
        .then(() => {
            toast.success("Comment deleted")
        })
    }

    return(
        <section className={styles.container} onClick={(e) => e.stopPropagation()}>
            <div>
                {data.img_url ? (
                    <div className={styles.imageContainer}>
                        <div className={styles.details}>
                            <p>@{data.username} · {formatTime(new Date(data.created_datetime))}</p>
                            <h4>{data.title}</h4>
                        </div>
                        <img src={data.img_url} alt="Post image" />
                    </div>
                ) : (
                    <div className={styles.postContainer}>
                        <h4>{data.title}</h4>

                        <div className={styles.cardInfo}>
                            <p>@{data.username} · {formatTime(new Date(data.created_datetime))}</p>
                            <p className={styles.content}>
                                {data.content}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <h2>Leave a comment on {data.username}'s post</h2>

            <textarea 
                placeholder="Comment here" 
                className={styles.txtarea}
                value={comment}
                onChange={e => setComment(e.target.value)}
            >
            </textarea>

            <div className={styles.buttons}>
                <Button color="cancel" handleClick={onCancel}>
                    Cancel
                </Button>
                <Button disable={!comment} color="blue" handleClick={handleComment}>
                    {loading ? <TbLoader className={animate.loader} /> : 'Comment'}
                </Button>
            </div>

            {commentList.length > 0 && (
                <section className={styles.commentSec}>
                    {commentList.map( comment => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.info}>
                                <p>@{comment.username}</p>
                                <p>{formatTime(comment.commentedAt.toDate())}</p>
                            </div>
                            <p>{comment.comment}</p>
                            {comment.id === uid && (
                                <button title="Delete comment" onClick={handleDeleteComment}>
                                    <TbTrashXFilled/>
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            )}
        </section>
    )
}