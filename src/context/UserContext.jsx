import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


export let UserContext = createContext();

export default function UserContextProvider(props) {

    const  [UserLogin, setUserLogin] = useState(null);
    const [UserId, setUserId] = useState(null);
    
    const token = localStorage.getItem("userToken");
    useEffect(() => { //component did mount for reloading 
        if (token !== null) {
            setUserLogin(localStorage.getItem("userToken"));
            const {id } = jwtDecode(token);
            setUserId(id);
            console.log(id);

        }

    }, []);
    

    return (
        <UserContext.Provider value={{UserLogin, setUserLogin, UserId, setUserId}}>
            {props.children}
        </UserContext.Provider>
    );
}