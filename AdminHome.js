import React from "react";
import MenuAdmin from "./MenuAdmin";
import Footer from "./Footer"; 
import { Carousel } from 'react-bootstrap';  
const AdminHome = ()=> {
    return (
        
        <div >
          <MenuAdmin/>
          <h2>Welcome to E-Voting!</h2>
                <Carousel>
    <Carousel.Item>
          <img
            className="d-block w-100"
            src="\assets\images\RegisterImage.png" 
            alt="First slide"
          />
           <Carousel.Caption>  
            <p>"THIS is an online platform for evoting</p> 
           </Carousel.Caption>
        </Carousel.Item>  
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="\assets\images\LoginImage.png"  
            alt="First slide"
          />
           <Carousel.Caption>  
            <p>"To vote,simply select your candidate and sumbit </p> 
           </Carousel.Caption> 
           </Carousel.Item>
        </Carousel>
        </div>
        
    )
}
export default AdminHome;