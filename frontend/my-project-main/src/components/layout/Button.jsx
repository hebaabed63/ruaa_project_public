import { useState } from "react";

export default function Button(){

    const [name,setName]=useState("Ruaa");
    

     function ButtonClicked(){
        if(name =="Ruaa"){
            setName("Yousef") ;
        }else {
setName("Ruaa");
        }
    
 
}
    return(
        <div>
            <button style={{background:"pink"}} onClick={ButtonClicked}>Click me</button>
            <h2>{name}</h2>
        </div>
    );
}
