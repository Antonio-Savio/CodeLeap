import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserStateProps = {
    uid: string | null;
    username: string | null;
    email: string | null;
};

const initialState: UserStateProps = {
    uid: null,
    username: null,
    email: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(_state, action: PayloadAction<UserStateProps>) {
            return action.payload;
        },
        clearUser() {
            return initialState;
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
