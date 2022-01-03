import React,{createContext ,useContext,useReducer} from "react";

// import reducer,{initialState} from "./Reducer";

export const StateContext=createContext(); //helps in creating data layer box


//we are making the provider definition here 
export const StateProvider=({reducer,initialState,children})=>(

    //now what is our provider ? , it is our children
    <StateContext.Provider value={useReducer(reducer,initialState)}>
        {children}  {/* our app ,entire app hoga ye*/}
    </StateContext.Provider>
)

//allows us to pull info from data layer
//useState is our own hook 
//use of useContext here
export const useStateValue=()=>useContext(StateContext);
