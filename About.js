import React from 'react';  
import Menu from "./Menu";

const About = () => {
    return (
        <div style={styles.container}> 
        <Menu/>
            <h1 style={styles.heading}>About e-Voting System</h1>
            <p style={styles.paragraph}>
                Welcome to our e-Voting System, a platform designed to facilitate secure and efficient electronic voting. 
                Our mission is to provide a reliable and transparent voting solution that upholds democratic principles. 
                The e-Voting System is an innovative platform that revolutionizes the way voting is conducted. 
                It leverages modern technology to ensure the integrity and security of the voting process, 
                making it accessible and convenient for voters worldwide.
            
            </p>
            
            <h2 style={styles.subHeading}>Features</h2>
            <ul style={styles.list}>
                <li>Secure authentication and authorization mechanisms</li>
                <li>Encrypted vote transmission</li>
                <li>Real-time result tabulation</li>
                <li>User-friendly interface</li>
            </ul>
            
            <h2 style={styles.subHeading}>Team</h2>
            <p style={styles.paragraph}>
                Our e-Voting System is developed and maintained by a team of dedicated professionals committed to ensuring 
                the integrity and reliability of the voting process. Meet our team:
            </p>
            <ul style={styles.list}>
                <li>Mama - Lead Developer</li>
                <li>Pinky- UI/UX Designer</li>
                <li>other - Security Expert</li>
            </ul>
            
            <h2 style={styles.subHeading}>Legal</h2>
            <p style={styles.paragraph}>
                Our e-Voting System operates in accordance with all relevant laws and regulations. Please refer to our 
                <a href="/privacy" style={styles.link}>Privacy Policy</a> and 
                <a href="/terms" style={styles.link}>Terms of Service</a> for more information.
            </p>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '10000px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: ' #FFFFE0',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        color: '#333',
    },
    heading: {
        color: '#1e88e5',
        textAlign: 'center',
        marginBottom: '20px',
    },
    subHeading: {
        color: '#1e88e5',
        marginTop: '30px',
    },
    paragraph: {
        color: '#666',
        lineHeight: '1.5',
    },
    list: {
        color: '#666',
        paddingLeft: '20px',
    },
    link: {
        color: '#1e88e5',
        textDecoration: 'none',
        marginLeft: '5px',
    }
};

export default About;
