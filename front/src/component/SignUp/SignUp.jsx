import React, { useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, FormLabel, } from '@mui/material';
import axios from 'axios';
import './SignUp.css';
import { Link } from 'react-router-dom'; // ייבוא של Link מ-React Router



const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 4) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (!firstName) {
      setFirstNameError(true);
      isValid = false;
    } else {
      setFirstNameError(false);
    }

    if (!lastName) {
      setLastNameError(true);
      isValid = false;
    } else {
      setLastNameError(false);
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const emailCheckResponse = await axios.post("http://localhost:3030/api/check-email", { email });
      
      if (emailCheckResponse.status === 200) {
        const response = await axios.post("http://localhost:3030/api/signup", { firstName, lastName, email, password });
        if (response.status === 200) {
          alert("User created successfully!");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("User alrady register.");
      }
    }
  };

  return (
    <Box sx={{
      backgroundImage: 'url("https://www.elal.com/magazine/wp-content/uploads/2019/06/shutterstock_627188573.jpg")', /* התמונה כהרקע */
      backgroundSize: 'cover', /* תוודא שהתמונה תכסה את כל המסך */
      backgroundPosition: 'center center', /* תמקם את התמונה במרכז */
      backgroundAttachment: 'fixed', /* התמונה נשארת קבועה כשאתה גולל */
      minHeight: '100vh', /* תוודא שהתמונה תכסה את כל גובה המסך */
      display: 'flex', /* מרכז את התוכן */
      justifyContent: 'center', /* ממרכז את התוכן אופקית */
      alignItems: 'center', /* ממרכז את התוכן אנכית */
    }}>
      

    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, 
        maxWidth: 400, 
        width: '100%', 
        padding: 3, 
        borderRadius: 3, 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        textAlign: 'center',
      }}
      >
      <Typography variant="h4" mb={2}>Register</Typography>
      <FormControl>
        <FormLabel htmlFor="first_name">First Name</FormLabel>
        <TextField 
          required 
          fullWidth 
          id="firstName" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          error={firstNameError} 
          helperText={firstNameError && "First Name is required."} 
          />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="last_name">Last Name</FormLabel>
        <TextField 
          required 
          fullWidth 
          id="lastName" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          error={lastNameError} 
          helperText={lastNameError && "Last Name is required."} 
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField 
          required 
          fullWidth 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          error={emailError} 
          helperText={emailError && "Please enter a valid email."} 
          />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">Password</FormLabel>
        <TextField 
          required 
          fullWidth 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          error={passwordError} 
          helperText={passwordError && "Password must be at least 4 characters."} 
          />
      </FormControl>
      <Button type="submit" fullWidth variant="contained">Sign up</Button>
      
       {/* הוספת שאלה לקישור לעמוד ה-Login */}
       <Typography variant="body2" mt={2}>
          Already have an account? <Link to="/SignIn">Sign in</Link>
        </Typography>
    </Box>
          </Box>
  );
};

export default SignUp;