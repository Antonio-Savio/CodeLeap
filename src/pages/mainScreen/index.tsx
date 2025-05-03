import { useEffect, useState } from "react"
import animate from '../../utils/styles/spinAnimation.module.css'
import styles from './mainScreen.module.css'
import { Layout } from "../../components/Layout"
import { PostCard } from "../../components/postCard"
import { CreatePost } from "../../components/createPost"
import { db } from "../../services/firebaseConnection"
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore"
import { TbLoader } from "react-icons/tb"

export interface PostsProps{
    id: string;
    title: string;
    content: string;
    user: UserProps;
    img_url: string;
    createdAt: Timestamp;
    likes: number;
    comments: number
}

interface UserProps{
    uid: string;
    email: string;
    username: string;
}

export function Home() {
    const [posts, setPosts] = useState<PostsProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getPosts(){
            const postsRef = collection(db, "posts");
            const q = query(postsRef, orderBy("createdAt", "desc"))

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
                setLoading(false)
            })
        }

        getPosts();
    }, [])

    return (
        <Layout>
            <CreatePost/>
            {loading ? (
                <div className={styles.loadContainer}>
                    <TbLoader className={animate.loader} />
                </div>
            ) : (
                posts.map( post => (
                    <PostCard 
                        key={post.id}
                        data={post}
                    />
                ))

            )}
        </Layout>
    )
}