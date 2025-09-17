import React, { useState, useEffect } from "react";
import MenuAdmin from "./MenuAdmin";
import Footer from "./Footer";
import axios from 'axios';

const AdminUserManagement= ()=> {
  const [data, setData] = useState([]); 
  const [userData, setUserData] = useState({ 
    username: '', 
    password: '',
    aadharno: '',
    address: ''
  });
  const [editEmail, setEditEmail] = useState(null); 
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get('http://localhost:3001/getUser');
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }  
  const handleEdit = async (email) => {
    try {
      const result = await axios.get(`http://localhost:3001/getUserByEmail/${email}`);
      setUserData(result.data);
      setEditEmail(email);
      setEditMode(true);
    } catch (error) {
      console.error('Error fetching user data for editing:', error);
    }
  };
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/updateuser/${editEmail}`, userData);
      fetchData();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  
  
  

  const handleDelete = async (email) => {
    try {
      if( window.confirm("Do you want delete ? please click on OK to proceed") === true) {
          await axios.delete(`http://localhost:3001/deleteuser/${email}`);
          fetchData();
      } 
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

    return (
        <React.Fragment>
        <div className="wrapper"  style={styles.wrapper}>
          <MenuAdmin/>
          <div className="container content">
            <div className="row" style={{paddingTop:'30px'}}>
                <div className="col-md-12">                
                <h4 style={{ marginBottom: '20px' }}>Users List</h4>
                  <table className="table table-bordered table-striped ">
                    <thead className="thead-dark">
                      <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Email</th>
                        <th>Aadhar No</th>
                        <th>Address</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                      data.map((record) => (
                        <tr key={record.id}>
                          <td>{record.username}</td>
                          <td>{record.password}</td>
                          <td>{record.email}</td>
                          <td>{record.aadharno}</td>
                          <td>{record.address}</td>
                          <td>
                              <button className="btn btn-primary"onClick={() => handleEdit(record.email)}>Edit</button> &nbsp; | &nbsp; 
                              <button className="btn btn-danger" onClick={() => handleDelete(record.email)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>  
                  {editMode && (
                <div>
                  <h4>Edit User</h4>
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" />
                    <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
                    <input type="text" name="aadharno" value={userData.aadharno} onChange={handleChange} placeholder="Aadhar No" />
                    <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Address" />
                    <button type="submit">Save</button>
                  </form>
                </div>
              )}     
                </div>
            </div>
        
            </div>
          <Footer/>
        </div> 
        
            

        </React.Fragment>
    )
} 
const styles = {
  wrapper: { 
    backgroundColor: '#fff0f5',
    backgroundSize: 'cover',
    minHeight: '100vh',
    paddingTop: '70px', // Adjust as per your layout
  },
  table: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    borderRadius: '8px',
    padding: '20px',
  }
};
export default AdminUserManagement;