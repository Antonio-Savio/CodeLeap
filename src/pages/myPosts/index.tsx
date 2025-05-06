import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import styles from './myposts.module.css'
import animate from '../../utils/styles/spinAnimation.module.css'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store'
import { PostCard } from "../../components/postCard";
import { PostsProps } from "../../store/postSlice";
import { TbLoader } from "react-icons/tb";
import { api } from "../../services/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import toast from "react-hot-toast";
import { setPosts, ApiResponse } from "../../store/postSlice"

export function MyPosts() {
    const { uid } = useSelector((state: RootState) => state.user);
    const { posts } = useSelector((state: RootState) => state.posts);
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getPosts() {
            try {
                const res = await api.get("/");
                const apiPosts: ApiResponse[] = res.data.results;
                const snapshot = await getDocs(collection(db, "posts"));
    
                const firebaseData: Record<string, { user_uid: string; img_url: string; docId: string }> = {};
    
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    firebaseData[data.postId] = {
                        user_uid: data.user_uid,
                        img_url: data.img_url,
                        docId: doc.id,
                    };
                });
    
                const allPosts: PostsProps[] = apiPosts.map((apiPost) => {
                    const firebaseInfo = firebaseData[apiPost.id];
    
                    return {
                        ...apiPost,
                        user_uid: firebaseInfo?.user_uid || "",
                        img_url: firebaseInfo?.img_url || "",
                        docId: firebaseInfo?.docId || "",
                    };
                });
                
                const filteredPosts = allPosts.filter(post => post.user_uid === uid);
                
                dispatch(setPosts(filteredPosts));

            } catch(err) {
                toast.error("Error loading posts");
            } finally {
                setLoading(false);
            }
        }

        getPosts();
    }, [uid])

    return(
        <Layout>
            <h1 className={styles.h1}>My Posts</h1>
 
            {loading ? (
                <div className={styles.loadContainer}>
                    <TbLoader className={animate.loader} />
                </div>
            ) : (
                posts.length === 0 ? (
                    <p className={styles.warn}>
                        Your posts will be listed here.
                    </p>
                ) : (
                    posts.map( post => (
                        <PostCard
                            data={post}
                            key={post.id}
                        />
                    ))
                )
            )}                    
        </Layout>
    )
}