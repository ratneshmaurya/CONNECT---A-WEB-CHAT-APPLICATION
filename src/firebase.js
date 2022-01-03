import { initializeApp } from "firebase/app"
import {getFirestore ,collection,getDocs,addDoc} from 'firebase/firestore';
import {getAuth ,GoogleAuthProvider} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA1J1lmcvfe1SqIpZVKOJrGTWHWskRQo3w",
    authDomain: "whatsapp-clone-ace42.firebaseapp.com",
    projectId: "whatsapp-clone-ace42",
    storageBucket: "whatsapp-clone-ace42.appspot.com",
    messagingSenderId: "420365674545",
    appId: "1:420365674545:web:4cd6168444092c76208d10",
    measurementId: "G-WTY20RGD57"
  };

initializeApp(firebaseConfig); //for initialising app with firebaseConfig files
const db = getFirestore(); //instance for handling database queries
const auth=getAuth();
const provider = new GoogleAuthProvider();

export {collection,getDocs,addDoc,auth,provider};
export default db;