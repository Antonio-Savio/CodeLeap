import { useEffect, useState } from 'react';
import styles from './postCard.module.css'
import { TbTrashXFilled, TbEdit } from 'react-icons/tb'
import { IoMdThumbsUp, IoMdChatboxes } from "react-icons/io";
import { ModalStructure } from '../modals/modalStructure';
import { DeleteModal } from '../modals/deleteModal';
import { EditModal } from '../modals/editModal';
import { useSelector } from 'react-redux'
import type { RootState } from '../../store';
import { PostsProps } from "../../store/postSlice"
import { doc, setDoc, deleteDoc, getDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from '../../services/firebaseConnection';
import { useNavigate } from 'react-router-dom';
import { CommentModal } from '../modals/commentModal';
import { formatTime } from '../../utils/time/formatTime';

interface PostCardProps{
    data: PostsProps
}

export function PostCard({ data }: PostCardProps){
    const { uid } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [liked, setLiked] = useState(false);
    const [commented, setCommented] = useState(false);
    const [likeCount, setLikeCount] = useState<number>();
    const [commentCount, setCommentCount] = useState<number>();

    useEffect(() => {
        if (uid) {
            const likesRef = collection(db, "posts", data.docId, "likes");

            const unsubscribe = onSnapshot(likesRef, (snapshot) => {
                const userLiked = snapshot.docs.some((doc) => doc.id === uid);
                setLiked(userLiked);
            })

            return () => unsubscribe();
        }
    }, [])

    useEffect(() => {
        const likesRef = collection(db, "posts", data.docId, "likes");
        const commentsRef = collection(db, "posts", data.docId, "comments");
        
        const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
            setLikeCount(snapshot.size);
        });
        
        const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
            setCommentCount(snapshot.size);
            const userCommented = snapshot.docs.some((doc) => doc.id === uid);
            setCommented(userCommented)
        });
        
        return () => {
            unsubscribeLikes();
            unsubscribeComments();
        };

    }, []);
    
    async function toggleLike() {
        if (uid) {
            const likeRef = doc(db, "posts", data.docId, "likes", uid);

            const docSnap = await getDoc(likeRef);
          
            if (docSnap.exists()) {
                await deleteDoc(likeRef);
            } else {
                await setDoc(likeRef, {
                    likedAt: new Date()
                });
            }
        } else {
            navigate('/signin')
        }
    }

    function handleComment(){
        if (!uid) {
            navigate('/signin')
        } else {
            setOpenCommentModal(true);
        }
    }

    return(
        <>
            <section className={styles['card-box']}>
                <div className={styles['card-head']}>
                    <h2>{data.title}</h2>
                    {data.user_uid === uid && (
                        <div className={styles.buttons}>
                            <button onClick={() => setOpenDeleteModal(true)}><TbTrashXFilled/></button>
                            <button onClick={() => setOpenEditModal(true)}><TbEdit/></button>
                        </div>
                    )}
                </div>

                {data.img_url && (
                    <div className={styles.paddingBox}>
                        <div 
                            className={styles.containerImg}
                            onClick={() => uid && setOpenCommentModal(true)}
                        >
                            <img src={data.img_url} alt="Post image" />
                        </div>
                    </div>
                )}

                <div className={styles['card-info']}>
                    <p>@{data.username}</p>
                    <p>{formatTime(new Date(data.created_datetime))}</p>
                </div>
                <p className={styles.content}>
                    {data.content}
                </p>
                <div className={styles['social-buttons']}>
                    <span>
                        <button 
                            onClick={toggleLike} 
                            className={`${liked ? styles.liked : ''}`}
                            title={liked ? 'Remove like' : 'Like'}
                        >
                            <IoMdThumbsUp/>
                        </button>
                        {likeCount} 
                    </span>
                    <span>
                        <button 
                            onClick={handleComment}
                            className={`${commented ? styles.commented : ''}`}
                            title='Open comment section'
                        >
                            <IoMdChatboxes/>
                        </button>
                        {commentCount}
                    </span>
                </div>
            </section>

            {openDeleteModal && (
                <ModalStructure
                    onCancel={() => setOpenDeleteModal(false)}
                >
                    <DeleteModal 
                        postId={data.id}
                        docId={data.docId}
                        onCancel={() => setOpenDeleteModal(false)} 
                    />
                </ModalStructure>
            )}

            {openEditModal && (
                <ModalStructure
                    onCancel={() => setOpenEditModal(false)}
                >
                    <EditModal 
                        onCancel={() => setOpenEditModal(false)}
                        editTitle={data.title}
                        editContent={data.content}
                        idPost={data.id}
                    />
                </ModalStructure>
            )}

            {openCommentModal && (
                <ModalStructure
                    onCancel={() => setOpenCommentModal(false)}
                >
                    <CommentModal
                        onCancel={() => setOpenCommentModal(false)}
                        data={data}
                    />
                </ModalStructure>
            )}
        </>
    )
}