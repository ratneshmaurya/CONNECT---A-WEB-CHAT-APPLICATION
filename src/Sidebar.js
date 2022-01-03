import React ,{useEffect,useState}from 'react'
import "./Sidebar.css";
import {Avatar,IconButton} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SidebarChat from './SidebarChat'; //component for chatheads on left side



import db, { auth } from './firebase';
import { collection,onSnapshot } from 'firebase/firestore';
import { useStateValue } from './StateProvider';
import { signOut } from 'firebase/auth'; //i am using when user click profile pic , it gets logout

function Sidebar() {

    //------------firebase data concept
    const [rooms, setRooms] = useState([]); //all the rooms or chat section from database
    //run useeffect once only once the sidebar loads only 
    useEffect(() => {
        const colRef=collection(db,'rooms');
        const unsubsCol=onSnapshot(colRef,(snapshot)=>{
            setRooms(snapshot.docs.map((doc)=>(
                {
                    id:doc.id, //giving the ID of doc , that will help in fetching the room name for chat header ,as we are passing this room id in form of props
                    data:doc.data(),
                }
            )))
        })

        //a good practice is to use unsubscribe from listener when useEffect cleanup ho rha ho , i.e when finish using it , so that ye onSnapshot listener further listen na kre 
        return ()=> {
            unsubsCol();
        }
    }, [])

    //--------------------------------------
    const [searchValue, setSearchValue] = useState(""); //for stroing the search value text


    const[{user},]=useStateValue(); //using our created data layer , in this page hum user ka pic le rhe
    return (
        <div className="sidebar">
            <div className="sidebar__header">

                <div className="sidebar__headerLeft">
                <Avatar src={user.photoURL} onClick={e=>signOut(auth)}/>
                <div className='sidebar__username'>
                    <h5>{user.displayName}</h5>
                </div>
                </div>

                <div className="sidebar__headerRight">
                    <IconButton>{/* for having clickabe effect */}
                    <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon/>

                    {/* here taking value from input and storing in variable searchValue to implement searching using filter function when showing all the rooms before mapping */}
                    <input value={searchValue} placeholder="Let's Search or Chat" type="text" onChange={(e)=>{setSearchValue(e.target.value)}}></input>
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat/>
                {/* before showing direct mapping of room names , we first filter them on basis of seacrhed text then after filter we get an array on return , that array we will map further */}

                {rooms.filter((val)=>{
                    if(searchValue==""){
                        return val; //if nothing in search text then simply return all values
                    }
                    else if(val.data.name.toLowerCase().includes(searchValue.toLowerCase())){
                        return val;
                    }
                }).map((room)=>(
                    <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
