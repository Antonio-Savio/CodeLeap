import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ApiResponse{
  id: string;
  title: string;
  content: string;
  username: string;
  created_datetime: Date;
}

export interface PostsProps extends ApiResponse{
  docId: string;
  user_uid: string;
  img_url: string;
}

type PostStateProps = {
  posts: PostsProps[];
};

const initialState: PostStateProps = {
  posts: [],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<PostsProps[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<PostsProps>) {
      state.posts.unshift(action.payload);
    },
    updatePost(state, action: PayloadAction<{ id: string; title: string; content: string }>) {
      const { id, title, content } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === id);
  
      if (postIndex !== -1) {
          state.posts[postIndex].title = title;
          state.posts[postIndex].content = content;
      }
    },
    removePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    }
  }
});

export const { setPosts, addPost, updatePost, removePost } = postSlice.actions;
export default postSlice.reducer;
