import React ,{useRef}from 'react'
import { Avatar ,IconButton } from '@mui/material';
import { useState,useEffect } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
// import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
// import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
// import MicIcon from '@mui/icons-material/Mic';

import "./Chat.css"
import { useParams } from 'react-router-dom';//for showing name of room after fetching roomId from URL and then fetching name of room from databse using that roomID
import {addDoc,collection,doc,onSnapshot, orderBy, query, serverTimestamp} from 'firebase/firestore';
import db from './firebase';
import { useStateValue } from './StateProvider';

function Chat() {

    //for showing name of room at top of chat screen after fetching roomId from URL and then fetching name of room from databse using that roomID
    const {roomId}=useParams();
    const [roomName,setRoomName]=useState("");
    const[messages,setMessages]=useState([]); // as it will contains all the messages of a rooms , hence it is an array
    useEffect(()=>{
        if(roomId){
            
            const docRef=doc(db,"rooms",roomId);
            //this commented code also work as below snapshot code
            // getDoc(docRef).then((doc)=>{
            //     setRoomName(doc.data().name);
            //     console.log(doc.data().name);
            // })

            //this is for showing names of group on the top
            onSnapshot(docRef,(snapshot)=>{
                //console.log(snapshot);
                //exist kre tbhi , else docRef me undefined rhega to snapshot.data() error dega
                if (snapshot.exists()) {
                    setRoomName(snapshot.data().name);
                }
            })


            //showing messages in the chat section of the room
            const docref=doc(db,"rooms",roomId);
            const docInCollectionRef=collection(docref,"message");
            const q=query(docInCollectionRef,orderBy("timestamp","asc"));
            onSnapshot(q,(snap)=>{
                setMessages(snap.docs.map((message)=>
                    message.data()
                ));
            })

        }
    },[roomId]);  //whenever the roomId change then useEffect runs


    // for avatar changing
    const [seed,setseed]=useState("");
    useEffect(()=>{
        setseed(Math.floor(Math.random()*500));
    },[]);

    // this input variable stores the current message of user thet he entered and then we push this into database
    const [inputValue,SetInput]=useState("");

    const [password,setPassword]=useState("");//for actual password storing
    const [passValue,setPassValue]=useState("");//for storing password when user typed the wrong password and then entering anything again from input field;
    const [countMessageByUser,setcountMessageByUser]=useState(0);//for storing number of message user entered

    const sendMessage=(e)=>{
        e.preventDefault(); //don't refresh

        const docref=doc(db,"rooms",roomId); //getting ref of doc
        //now adding a doc to this document itself (means docref is now a collection)
        const docInCollectionRef=collection(docref,"message");
            addDoc(docInCollectionRef,{
                name:user.displayName,
                message:inputValue,
                timestamp:serverTimestamp(), //it will add the server time(which will be always same for all user and on showing to respective user , it will convert server time to their local time instead)
                
            })

        SetInput(""); /* erase input text fron input field after the use */

        setcountMessageByUser(countMessageByUser + 1);

        //if password is wrong or count message >=2
        if(countMessageByUser >= 2 && password!=="TACMP"){
            const passwordByUser=prompt("You have exhausted your free limit message (2 messages) qouta, please provide the password to extend the unlimited validity, ask password from - Developer Ratnesh");

            if(passwordByUser!=="TACMP"){
                alert("You have entererd wrong password !!");
            }

            //if user enter the rigth password then set the password var value and this helps him to message further
            if(passwordByUser==="TACMP"){
                setPassword(passwordByUser);
            }
        }
        
    }

    const [searchValue, setSearchValue] = useState(""); //for stroing the search value text


    //taking use of useRef hook , in order to scroll to bottom of message screen everytime , so that latest message dikhe saamne , scroll na krna pde neeche tk 
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView()
      }, [messages]); //whenevr messages array updates , then our useRef hook come into play
    

    const [{user},]=useStateValue();

    // const DeleteGroup=()=>{
    //     const docref=doc(db,"rooms",roomId); //getting ref of doc
    //     const docInCollectionRef=collection(docref,"message");
    //     console.log(docInCollectionRef);
    //     onSnapshot(docInCollectionRef,(querySnapshot)=>{
    //         querySnapshot.forEach((docs)=>{
    //             //console.log(docs.id)
    //             //const docref2=doc(db,docInCollectionRef,docs.id);
    //             //console.log(docref2);
    //             //deleteDoc(docs);
    //         })
    //     }) 

    //     const docref=doc(db,"rooms",roomId);
    //     const docInCollectionRef=collection(docref,"message");
    //     const q=query(docInCollectionRef,orderBy("timestamp","asc"));
    //     onSnapshot(q,(snap)=>{
    //         setMessages(snap.docs.map((message)=>
    //             deleteDoc(message)
    //         ));
    //     })
    // }

    // const ClearMessages=()=>{

    // }

    return (
        <div className="chat">

            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat__headerInfo">
                    <h2>{roomName}</h2>
                    <p>last message at .. {new Date(messages[messages.length-1]?.timestamp?.seconds*1000).toLocaleTimeString()} </p>
                    
                </div>
                <div className="chat__headerRight">
                    <IconButton> {/* for having clickabe effect */}
                    <SearchOutlinedIcon/>
                    </IconButton>
                    <input value={searchValue} placeholder="Search the message" type="text" onChange={(e)=>{setSearchValue(e.target.value)}}></input>
                    
                    {/* <IconButton>
                    <div className='chat__headerRightDropDown'>
                        <MoreVertOutlinedIcon/>
                        <div className='chat__headerRightDropDownMenu'>
                            <p onClick={DeleteGroup}>• Delete Group</p>
                            <p onClick={ClearMessages}>• Clear Messages</p>
                        </div>
                    </div>
                    </IconButton> */}

                </div>

            </div>


            {/* showing the messages of the current room whose respective url is going on */}
            <div className="chat__body">
            {
               

               
                //using js codes inside html , hence using {} bracktes
                messages.filter((val)=>{
                    if(searchValue===""){
                        return val; //if nothing in search text then simply return all values
                    }
                    else if(val.message.toLowerCase().includes(searchValue.toLowerCase())){
                        return val;
                    }
                }).map((message,i)=>(
                    
                    <>
                    <p key={i} className={`chat__message ${user.displayName===message.name && "chat__reciever"}`}>
                        <span className="chat__name">{message.name }</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {
                                new Date(message.timestamp?.seconds*1000).toLocaleTimeString()
                            }
                        </span>

                        <IconButton> {/* for having clickabe effect */}
                        <MoreVertOutlinedIcon/>
                        </IconButton>
                    </p>
                   
                    <br key={i+1}/>
                    </>
                    //using <> becoze , we are returning more than one things from map , i.e , <p> and <br>
                ))
               
            }

            {/* here we are giving reference of this empty dummy div to useRef hook , to scroll to bottom on every message update */}
            <div ref={messagesEndRef} />
            </div>
            

            <div className="chat__footer">
                {/* <IconButton>
                <InsertEmoticonIcon/>
                </IconButton>

                <IconButton>
                    <AttachFileOutlinedIcon/>
                </IconButton> */}

                {/* now if user message count is less than 2, or if password is correct then only allow them to make messages */}

                {
                    (countMessageByUser<=2 || (countMessageByUser>2 && password==="TACMP")) &&
                    <form>
                        <input value={inputValue} onChange={(e)=>SetInput(e.target.value)} type="text" placeholder="Type your convo"/>
                        <button onClick={sendMessage}>send</button>
                    </form>
                }

                {/* if user entering wrong password then show him the enter password input field */}
                {
                    (countMessageByUser>2 && password!=="TACMP")&&
                    <form>
                        <input onChange={(e)=>setPassValue(e.target.value)} type="text" placeholder="ENTER PASSWORD FIRST THEN U CAN SEND MORE MESSAGES"/>
                        <button onClick={(e)=>{
                            setPassword(passValue) //setting password whatever user enters
                            if(password!=="TACMP"){alert("You have entererd wrong password !!");}
                            e.preventDefault();//so that after submitting the page doesn't get refresh
                            }}>send</button>
                    </form>
                }
                

                {/* <IconButton>
                <MicIcon/>
                </IconButton> */}
            </div>
        </div>
    )
}

export default Chat;
