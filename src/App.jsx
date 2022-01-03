import React ,{useEffect}from 'react'
import "./App.css";
import Sidebar from './Sidebar';
import Chat from './Chat';
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom' ;
import Login from './Login';
import { useStateValue } from './StateProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {

    //const[state,dispatch] hota , hm seedhe destructor krke 'state object' me se user nikal rhe bss;
    const[{user},dispatch]=useStateValue();//pulling user from our created data layer if exist


    //this helps in preventing logging again and again on every refresh or start-up (if user ne already login kr rkha hoga toh cache me user hoga hi , thus dubara login na kraye)
    useEffect(() => {
       onAuthStateChanged(auth,(user)=>{
           dispatch({
               type:"SET_USER",
               user:user,
           })
       })
    }, [])

    return (
        <div className="app">
        {/* if there is user then show whole app else show login page */}
        {!user?(<Login/>):
        (
            <>
            <div className="app__body">
                <Router>
                    <Sidebar/>
                    <Routes>
                        <Route path="/room/:roomId" element={<Chat/>}></Route>
                        <Route path="/" element={<Chat/>}></Route>
                    </Routes>
                </Router>
            </div>

            <div className='app__info'>
                <div className='app__NameInfo'>
                🔗 CONNECT 🔗
                </div>
                
                <div className='app__middleSpace'></div>

                <div className='app__developerInfo'>
                Made with ❤️ ~ by RATNESH MAURYA :-)
                </div>
            </div>
            
            </>     
        )   
        }   
        </div>
    )
}

export default App
