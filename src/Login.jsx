import React from 'react';
import {Button} from "@mui/material";

import "./Login.css";
import {signInWithPopup} from "firebase/auth";
import { auth, provider } from './firebase';
import { useStateValue } from './StateProvider'; //to take value from our created data layer
function Login() {
    const[{},dispatch]=useStateValue(); //for pushing user into our created data layer

    const signIn=()=>{
        signInWithPopup(auth,provider).then((result) => {
            dispatch({
                type:"SET_USER",
                user:result.user,
            })
        }).catch(error=>alert(error.message));
    }
    return (
        <div className='login'>
            <div className='login__container'>
                <img src="https://cdn.pixabay.com/photo/2012/04/11/15/57/speech-28654__480.png" alt="login"/>
                <div className='login__text'>
                    <h1>Whooo Hooo !!</h1>
                    <h2>Thanks for being here </h2>
                    <h3>Please Sign-In first to connect with friends.....</h3>
                </div>
                <Button type="submit" onClick={signIn}>
                    Sign-In with Google
                </Button>
            </div>
        </div>
    )
}

export default Login
