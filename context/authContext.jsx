import React, {createContext, useState, useEffect} from 'react';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert} from 'react-native';
import jwt_decode from "jwt-decode";


const JWT_Secret = "geguergjndgdnfgjfnfsdieapa3435334vgedffsgdbds"

export const AuthContext = createContext();
;

export const AuthProvider =({children})=>{
    const [loading, setloading] = useState(false);
    const [userToken, setuserToken] = useState(null);
    const [userId,setuserId]=useState(null)
    
    
 
   
    const login =(email,password)=>{ 
        axios.post("https://safebite.onrender.com/login", {email,password})
        .then((response)=>{
            
            setuserToken(response.data);
            setloading(false);
            AsyncStorage.setItem('AccessToken', response.data);
            
           
        })
        .catch((err)=>{
            
             if(err.response.status===404){ return Alert.alert("error","email incorrect")}
             if(err.response.status===401){ return Alert.alert("error","please fill all")}
             if(err.response.status===404){ return Alert.alert("error","mot de passe incorrect")}


        })
    }
    const logout =()=>{ 
        setloading(true)
        setuserToken(null)
        AsyncStorage.removeItem("AccessToken")
        setloading(false);
    }

    const islogged = async()=>{
        try{
            setloading(true);
            let userToken =await AsyncStorage.getItem("AccessToken") 
            var decoded = jwt_decode(userToken);
            setuserId(decoded.userId);
            axios.get(`https://safebite.onrender.com/users/${userId}/`).then((response)=>{console.log(response)})
            .catch((err)=>{console.log(err)})
            console.log(userId)
            setuserToken(userToken)
            setloading(false)
        }
        catch(err){
            console.log(err)

        }
        
    }
    useEffect(() => {
        islogged();
    }, []);
    return(
    <AuthContext.Provider value={{login, logout, loading,userToken,userId}}>
        {children}
    </AuthContext.Provider>
)}