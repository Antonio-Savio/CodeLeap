import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import styles from './myposts.module.css'
import animate from '../../utils/styles/spinAnimation.module.css'
import { PostsProps } from "../mainScreen";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { useSelector } from "react-redux";
import { RootState } from '../../store'
import { PostCard } from "../../components/postCard";
import { TbLoader } from "react-icons/tb";

export function MyPosts() {
    const { uid } = useSelector((state: RootState) => state.user)
    const [posts, setPosts] = useState<PostsProps[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getPosts(){
            const postsRef = collection(db, "posts");
            const q = query(
                postsRef, 
                orderBy("createdAt", "desc"), 
                where("user.uid", "==", uid)
            )

            await getDocs(q)
            .then((snapshot) => {
                let list: PostsProps[] = [];

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        title: doc.data().title,
                        content: doc.data().content,
                        user: doc.data().user,
                        img_url: doc.data().img_url,
                        createdAt: doc.data().createdAt,
                        likes: doc.data().likes,
                        comments: doc.data().comments
                    })
                })

                setPosts(list)
            })
            .finally(() => {
                setLoading(false);
            })
        }

        getPosts();
    }, [])

    return(
        <Layout>
            <h1 className={styles.h1}>My Posts</h1>

            {loading ? (
                <div className={styles.loadContainer}>
                    <TbLoader className={animate.loader} />
                </div>
            ) : (
                posts.length > 0 ? (
                    posts.map( post => (
                        <PostCard
                            data={post}
                            key={post.id}
                        />
                    ))
                ) : (
                    <p className={styles.warn}>
                        Your posts will be listed here.
                    </p>
                )
            )}
        </Layout>
    )
}