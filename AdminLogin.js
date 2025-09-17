import React, { useState } from "react";
import axios from 'axios';
import Menu from "./Menu";
import {useNavigate } from "react-router-dom"; 


const Login = ()=> {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '', 
        
      });
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); 
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3001/login', formData);
            if(response.data.message === 'success') {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('email',formData.email);
                navigate('/admin/adminhome');
            } else {
                setFormData({ ...formData, password: '' });
                setMessage(response.data.message);
            } 

        } catch (error) {
            setError(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
        <div className="wrapper">
          <Menu/>
          <div className="container content">
            <div className="row" style={{paddingTop:'30px'}}>
                <div className="col-md-6">
                    <div class="login-form mt-5">
                        <h2 class="mb-4">Admin Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="text" 
                                    class="form-control" 
                                    id="email" 
                                    name="email" 
                                    onChange={handleChange}
                                    required/>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" 
                                    class="form-control" 
                                    id="password" 
                                    value={formData.password}
                                    name="password" 
                                    onChange={handleChange}
                                    required/>
                            </div> 
                            
                            <button type="submit" class="btn btn-primary btn-block">Login</button>
                        </form>
                        {loading && (<h3 style={{color:'blue'}}>Proecssing..</h3>)}
                        {error && (<h3 style={{color:'red'}}>{error.message}</h3>)}
                        {message && (<h3 style={{color:'red'}}>{message}</h3>)}
                    </div>
                </div>
                <div className="col-md-6 mt-5">
                <h2>Welcome, Admin Login Page!</h2>
                  <p>enter your email and password</p>          
                </div>
            </div>
            </div>
          
        </div> 
        <style jsx>{` 
        .wrapper {
            background-image: url("/assets/images/Login1.png");
            background-size: cover;
            background-repeat: no-repeat;
            min-height: 100vh;
        }
                
                
            `} 
            </style>
        </React.Fragment>
    )
}
export default Login;