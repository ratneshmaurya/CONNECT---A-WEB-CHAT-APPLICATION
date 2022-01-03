import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {collection,addDoc} from './firebase'
import './SidebarChat.css' ;
import db from './firebase';
import {Link} from "react-router-dom";
import { doc, onSnapshot, orderBy, query } from 'firebase/firestore';
function SidebarChat({id ,name,addNewChat}) {
    //we are getting roomId of each caht as the prop name id from sidebar component

    const [seed,setseed]=useState("");
    const [lastMessages,setLastMessages]=useState([]);

    //isme hum avatar ke liye value and lastMessages ka array bna rhe(to show last message in the sidebarchat)
    useEffect(()=>{
        setseed(Math.floor(Math.random()*500));

        //for last message
        if(id)  //as when i console the id , it is showing also some undefined value , becoz the sidebarChat component also runs when addNewCHat protion comes , and during that id will not be passed thus having undefined value for id;
        {
        const docref=doc(db,"rooms",id);
        const docInCollectionRef=collection(docref,"message");
            const q=query(docInCollectionRef,orderBy("timestamp","desc"));
            onSnapshot(q,(snap)=>{
                    setLastMessages(snap.docs.map((message)=>
                    message.data()));
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const createChat=()=>{
        const roomName=prompt("Please add the room name for chat");
        // if enter the room name then do something (agr blank choda promp me toh database me na add kre)
        if(roomName){
            addDoc(collection(db,'rooms'),{
                name:roomName
            })
        }
    };
    
    return !addNewChat ?(
        <Link to={`/room/${id}`}>
            <div className="sidebarChat">
               <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="sidebarChat__info">
                    <h2>{name}</h2>  {/*getting name from sidebar props , don't confuse */}

                    <p>{lastMessages[0]?.message}</p>
                </div>   
            </div>
        </Link>
        
        ) :(
        <div onClick={createChat} className="sidebarChat"> 
            <h2>Add new chat</h2>
        </div>
        //if add new chatt hoga toh clicked hokrr hi aaya hoga
    )
}

export default SidebarChat
