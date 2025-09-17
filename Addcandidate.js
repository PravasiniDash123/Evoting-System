import React, { useState } from 'react';
import axios from 'axios'; 
import MenuAdmin from './MenuAdmin';

function AddCandidate() {
  const [name, setName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [partyImage, setPartyImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('party_name', partyName);
    formData.append('partyImage', partyImage);

    try {
      const response = await axios.post('http://localhost:3001/candidates/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage('Candidate added successfully');
        setName('');
        setPartyName('');
        setPartyImage(null);
      }
    } catch (error) {
      setMessage('Failed to add candidate');
      console.error('Error:', error);
    }
  };

  return (
    <div className="App"style={styles.container}> 
    <MenuAdmin/>
      <h1>Add Candidate</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-group">
          <label htmlFor="name" style={styles.label}>Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="partyName" style={styles.label}>Party Name:</label>
          <input type="text" id="partyName" value={partyName} onChange={(e) => setPartyName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="partyImage" style={styles.label}>Party Image:</label>
          <input type="file" id="partyImage" accept="image/*" onChange={(e) => setPartyImage(e.target.files[0])} required />
        </div>
        <button type="submit" style={styles.button}>Add Candidate</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
} 
const styles = {
  container: {
    backgroundColor: '#f2f2f2',
    minHeight: '100vh',
    padding: '20px'
  },
ontainer: {
    
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px'
  },
  label: {
    display: 'block',
    marginBottom: '5px' 
  },
  input: { 
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff', 
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  message: { 
    marginTop: '15px', 
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px'
  }
};

   
  
export default AddCandidate;
