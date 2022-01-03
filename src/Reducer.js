
//when user not logged in
export const initialState={
    user:null
}

// //when we sign in go ahead and push this user in data layer(that we have created for contexting)
// export const actionTypes={
//     SET_USER:"SET_USER",
// };

//now checking what action is being performed
const reducer=(state,action)=>{
    switch(action.type){

        //if action is of setting user , i.e first login
        case "SET_USER":{
            return{

                //keep the state of data layer as it is , just change the user
                ...state,
                user:action.user,
            }
        }
        default:
            return state;
    }
}

export default reducer;