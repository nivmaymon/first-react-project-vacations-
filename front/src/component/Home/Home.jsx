import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{backgroundImage:'url("https://viaggio.co.il/wp-content/uploads/2021/02/%D7%AA%D7%90%D7%99%D7%9C%D7%A0%D7%93-1024x630.jpg")'
      ,backgroundSize: 'cover', /* תוודא שהתמונה תכסה את כל המסך */
      backgroundPosition: 'center center', /* תמקם את התמונה במרכז */
      backgroundAttachment: 'fixed', /* התמונה נשארת קבועה כשאתה גולל */
      minHeight: '100vh', /* תוודא שהתמונה תכסה את כל גובה המסך */
      display: 'flex', /* מרכז את התוכן */
    }}>

      <div style={{marginTop:"10px" ,}} >

      <Button variant="contained" color="warning" onClick={() => navigate('/signup')}>Go to Sign Up</Button>
      <Button variant="contained" color="warning" onClick={() => navigate('/signin')}>Go to Sign In</Button>
      </div>
    <div style={{marginTop:"50px" ,marginLeft:"80px"}}>
      <Typography variant="h3">Welcome to the Vacation Tagging System!</Typography>
    </div>
    
    </div>
  );
};

export default Home;