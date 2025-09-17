import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import MenuAdmin from './MenuAdmin';

function CandidateTable() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch candidates data when component mounts
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try { 
        if( window.confirm("Do you want delete ? please click on OK to proceed") === true) {
      await axios.delete(`http://localhost:3001/candidates/delete/${id}`);
      // After deletion, fetch updated candidate data
      fetchCandidates();
    } }catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  return (
    <React.Fragment>
    <div className="wrapper"style={styles.wrapper}>
      <MenuAdmin/>
      <div className="container content">
      <div className="row" style={styles.row}>
            <div className="col-md-12">                
              <h4 style={styles.heading}>Candidate List</h4>
              <table className="table table-bordered table-striped" style={styles.table}>
                <thead className="thead-dark">
                    <tr>
            <th style={styles.tableHeader} >Name</th>
            <th style={styles.tableHeader} >Party Name</th>
            < th style={styles.tableHeader} >Party Image</th>
            <th style={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate.id}>
              <td>{candidate.name}</td>
              <td>{candidate.party_name}</td>
              <td>
                <img src={`http://localhost:3001/uploads/${candidate.party_image}`} alt="Party Logo" style={{ maxWidth: '100px' }} />
              </td>
              <td>
                <button className="btn btn-danger"onClick={() => handleDelete(candidate.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> 
    </div> 
    </div> 
    </div> 
    </React.Fragment>
  );
}
const styles = {
    wrapper: {
      backgroundColor: '#ffe4b5',
      backgroundSize: 'cover',
      minHeight: '100vh',
      paddingTop: '70px',
    },
    row: {
      paddingTop: '30px',
    },
    heading: {
      marginBottom: '20px',
    },
    table: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
      borderRadius: '8px',
      padding: '20px', 
    },
    tableHeader: {
      fontWeight: 'bold',
    },
    partyImage: {
      maxWidth: '100px',
    }
  };
  
  
  
export default CandidateTable;
