import { useEffect, useState } from "react"
import animate from '../../utils/styles/spinAnimation.module.css'
import styles from './mainScreen.module.css'
import { Layout } from "../../components/Layout"
import { PostCard } from "../../components/postCard"
import { CreatePost } from "../../components/createPost"
import { db } from "../../services/firebaseConnection"
import { collection, getDocs } from "firebase/firestore"
import { TbLoader } from "react-icons/tb"
import { api } from "../../services/api"
import { useSelector, useDispatch } from "react-redux"
import { setPosts, ApiResponse } from "../../store/postSlice"
import { RootState } from "../../store"

export function Home() {
    const { posts } = useSelector((state: RootState) => state.posts);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getPosts() {
            setLoading(true);
    
            try {
                const res = await api.get('/');
                const apiPosts = res.data.results;
               
                const postsRef = collection(db, "posts");
                const snapshot = await getDocs(postsRef);
    
                const firestoreMap = new Map<string, any>();
    
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    firestoreMap.set(data.postId, {
                        docId: doc.id,
                        img_url: data.img_url || '',
                        user_uid: data.user_uid
                    });
                });
    
                const enrichedPosts = apiPosts.map((post: ApiResponse) => {
                    const firestoreData = firestoreMap.get(post.id);
                    return {
                        ...post,
                        docId: firestoreData?.docId,
                        img_url: firestoreData?.img_url || '',
                        user_uid: firestoreData?.user_uid
                    };
                });
    
                dispatch(setPosts(enrichedPosts));
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        }
    
        getPosts();
    }, []);

    return (
        <Layout>
            <CreatePost/>
            {loading ? (
                <div className={styles.loadContainer}>
                    <TbLoader className={animate.loader} />
                </div>
            ) : (
                <>
                    {posts.length === 0 && (
                        <p className={styles.warn}>
                            Network is empty.
                        </p>
                    )}
                    {posts.map( post => (
                        <PostCard 
                            key={post.id}
                            data={post}
                        />
                    ))}
                </>


            )}
        </Layout>
    )
}