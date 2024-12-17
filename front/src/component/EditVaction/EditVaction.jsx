import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

function EditVaction() {
  const { id } = useParams(); // Get the vacation ID from the URL
  const navigate = useNavigate();

  const [vacation, setVacation] = useState({
    vacation_destination: '',
    vacation_Description: '',
    vacation_start_date: '',
    vacation_end_date: '',
    price: '',
    img_name: ''
  });

  const [imageFile, setImageFile] = useState(null); // For new image upload

  // Fetch the vacation details from the server
  useEffect(() => {
    axios.get(`http://localhost:3030/api/vacations/${id}`)
      .then(response => {
        setVacation(response.data); // Set vacation details to state
      })
      .catch(error => {
        console.error("Error fetching vacation details:", error);
      });
  }, [id]); // Re-fetch if the ID changes

  const handleChange = (e) => {
    setVacation({
      ...vacation,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Set the image file selected by the user
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Price validation (should be between 0 and 10,000)
    const priceValue = parseFloat(vacation.price);
    if (priceValue < 0 || priceValue > 10000) {
      alert('The price must be between 0 and 10,000');
      return; // Prevent form submission if the price is invalid
    }

    const formData = new FormData();
    formData.append('vacation_destination', vacation.vacation_destination);
    formData.append('vacation_Description', vacation.vacation_Description);
    formData.append('vacation_start_date', vacation.vacation_start_date);
    formData.append('vacation_end_date', vacation.vacation_end_date);
    formData.append('price', vacation.price);

    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      // If no new image, send the current image name
      formData.append('image', vacation.img_name);
    }

    // Send the updated vacation details to the server
    axios.put(`http://localhost:3030/api/vacations/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('Vacation updated successfully!');
      navigate('/admin-dashboard'); // Redirect to the admin dashboard after successful update
    })
    .catch(error => {
      console.error('Error updating vacation:', error);
      alert('Failed to update vacation');
    });
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/signin");
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        navigate("/SignIn");
      }
    }
  }, [navigate]);

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setVacation({
      ...vacation,
      vacation_start_date: startDate,
    });
  };
  
  const handleEndDateChange = (e) => {
    const endDate = e.target.value;
    
    // Ensure the end date is not earlier than the start date
    if (endDate < vacation.vacation_start_date) {
      alert("End date cannot be earlier than start date.");
      return; // Prevent update if the end date is invalid
    }
    
    setVacation({
      ...vacation,
      vacation_end_date: endDate,
    });
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>Edit Vacation</Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
        <TextField
          name="vacation_destination"
          value={vacation.vacation_destination}
          required
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="vacation_Description"
          value={vacation.vacation_Description}
          required
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="Start Date"
          type="date"
          name="vacation_start_date"
          value={vacation.vacation_start_date}
          required
          onChange={handleStartDateChange} 
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          name="vacation_end_date"
          value={vacation.vacation_end_date}
          required
          onChange={handleEndDateChange}  
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={vacation.price}
          required
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
       {/* Display existing image */}
       {vacation.img_name && (
          <div style={{ margin: '20px 0' }}>
            <Typography variant="body1">Current Image:</Typography>
            <img 
              src={`http://localhost:3030/images/${vacation.img_name}`} 
              alt="Vacation" 
              style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Image upload input */}
        <TextField
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          fullWidth
          margin="normal"
        />
       <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default EditVaction;
