import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signin } from '../pages/signin';
import { Signup } from '../pages/signup';
import { Home } from '../pages/mainScreen';
import { MyPosts } from '../pages/myPosts';

export const routes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/signin' element={<Signin/>} />
                <Route path='/signup' element={<Signup/>} />
                <Route path='/myposts' element={<MyPosts/>} />
            </Routes>
        </BrowserRouter>
    )
}
