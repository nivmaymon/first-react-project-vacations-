import React, { useState,useEffect  } from 'react';
import { Box, Button, TextField, Typography, FormControl, FormLabel, } from '@mui/material';
import axios from 'axios';
import { Link,useNavigate  } from 'react-router-dom'; // יבוא של Link מ-React Router




function SignIn() {

    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate(); // יצירת ניווט
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());



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
    return isValid;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!validateInputs()) return;
  try {
      // בדיקת פרטי המשתמש עם axios
      const response = await axios.post("http://localhost:3030/api/signin", { email, password });

      if (response.status === 200) {
        // אם ההתחברות הצליחה, נשמור את המידע על המשתמש
        localStorage.setItem("user", JSON.stringify(response.data)); // שמירה ב-localStorage

        // נווט לעמוד המתאים לפי תפקיד המשתמש
        if (response.data.role === "admin") {
          navigate("/admin-dashboard"); // ניווט לדף ניהול מנהלים
        } else if (response.data.role === "User") {
          navigate("/vacations"); // ניווט לעמוד חופשות עבור משתמש רגיל
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // הצגת הודעת שגיאה
      } else {
        alert("Login failed. Please check your credentials.");
      }
    }
};

    useEffect(() => {
      const checkIdleTime = setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - lastActivityTime;
  
        if (timeElapsed > 15 * 60 * 1000) { // 15 דקות
          localStorage.removeItem("user");
          navigate("/signin"); // נווט לדף ההתחברות
          alert("You have been logged out due to inactivity.");
        }
      }, 10000); // בודק כל 10 שניות
  
      return () => clearInterval(checkIdleTime); // מנקה את ה-interval כשהקומפוננטה נמחקת
    }, [lastActivityTime, navigate]);
  
    // פונקציה זו תעדכן את זמן הפעילות כל פעם שהמשתמש מבצע פעולה
    const updateActivityTime = () => {
      setLastActivityTime(Date.now());
    };


    return ( 
    <>
     <Box sx={{
      backgroundImage: 'url("https://telechofesh.co.il/wp-content/uploads/2016/11/Cheap-holiday.jpg")', /* התמונה כהרקע */
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

      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField 
          required 
          fullWidth 
          id="email" 
          value={email} 
          onChange={(e) => {setEmail(e.target.value);updateActivityTime();} }
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
          onChange={(e) =>  { setPassword(e.target.value); updateActivityTime(); }}
          type="password" 
          error={passwordError} 
          helperText={passwordError && "Password must be at least 4 characters."} 
          />
      </FormControl>
      <Button type="submit" fullWidth variant="contained">Sign in</Button>
      <Typography variant="body2" mt={2}>
          Dont have an account? <Link to="/SignUp">Sign up</Link>
        </Typography>
    </Box>
          </Box>

    </>
     );
}

export default SignIn;