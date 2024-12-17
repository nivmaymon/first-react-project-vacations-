import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from '@mui/material';

const AddVacation = () => {
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store the image file selected by the user
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (price > 10000) {
      alert("The price cannot exceed 10000");
      return;
    }
    if (price < 0) {
      setError("Price cannot be negative");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date");
      return;
    }
  
    const formData = new FormData(); // Create FormData object
    formData.append("destination", destination);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("price", price);
    formData.append("image", imageFile);  // Use imageFile here instead of fileInput.files[0]

    axios
      .post("http://localhost:3030/api/vacations", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        console.log("Vacation added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding vacation:", error);
      });
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

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setError("Price cannot be negative");
      setPrice(0);  // Reset to 0 if negative value is entered
    } else if (value > 10000) {
      setError("Price cannot exceed 10000");
      setPrice(10000);  // Reset to 10000 if value exceeds 10000
    } else {
      setError(""); // Clear the error if the value is valid
      setPrice(value);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    // Ensure that start date is not in the past
    if (new Date(newStartDate) < new Date(today)) {
      setError("Start date cannot be in the past");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    // Ensure that end date is not earlier than start date
    if (new Date(newEndDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date");
    } else {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Set the image file selected by the user
    }
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>Add New Vacation</Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
        <TextField
          label="Destination"
          name="destination"
          value={destination}
          required
          onChange={(e) => setDestination(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={startDate}
          required
          onChange={handleStartDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today }} // Prevent past dates
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={endDate}
          required
          onChange={handleEndDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: startDate }} // Prevent selecting end date earlier than start date
        />
        {error && <Typography color="error">{error}</Typography>}
        
        <TextField
          label="Price"
          name="price"
          type="number"
          value={price}
          required
          onChange={handlePriceChange}
          fullWidth
          margin="normal"
        />
        <TextField
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          fullWidth
          required
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Add Vacation
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
};

export default AddVacation;
