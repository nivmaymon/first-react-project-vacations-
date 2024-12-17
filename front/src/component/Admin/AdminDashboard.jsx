import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
// import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [vacations, setVacations] = useState([]); // State for vacations
  const [page, setPage] = useState(1); // State for tracking the current page
  const [totalVacations, setTotalVacations] = useState(0); // State for tracking the total number of vacations

  // Date formatting function using date-fns
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy'); // Formats the date as "day/month/year"
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));

      // Fetch vacations data with pagination
      axios.get("http://localhost:3030/api/vacations/", { params: { page, limit: 10 } })
        .then(response => {
          // Ensure the vacations data is an array
          if (Array.isArray(response.data.vacations)) {
            setVacations(response.data.vacations); // Store vacations data
            setTotalVacations(response.data.totalVacations); // Set the total number of vacations for pagination
          } else {
            console.error("Vacations data is not an array", response.data);
            setVacations([]); // Fallback to empty array
          }
        })
        .catch(error => console.error("Error fetching vacations:", error));

    } else {
      navigate("/signin"); // Redirect to signin if user is not logged in
    }
  }, [navigate, page]); // Re-fetch vacations when the page changes

  const handleLogout = () => {
    // Remove the user information from localStorage
    localStorage.removeItem("user");

    // Update the user state
    setUser(null);

    // Redirect to sign-in page
    navigate("/signin");
  };

  const handleDeleteVacation = (vacationId) => {
    const confirmation = window.confirm("Are you sure you want to delete this vacation?");
    if (confirmation) {
      axios.delete(`http://localhost:3030/api/vacations/${vacationId}`)
        .then(response => {
          alert("Vacation deleted successfully!");
          setVacations(vacations.filter(vacation => vacation.ID !== vacationId)); // Remove the vacation from the state
        })
        .catch(error => {
          console.error("Error deleting vacation:", error);
          alert("Failed to delete vacation.");
        });
    }
  };

  const totalPages = Math.ceil(totalVacations / 10); // Calculate total pages

  return (
    <Box sx={{ padding: 3 }}>

      <Button color="primary" variant="contained" onClick={handleLogout}>Log Out</Button>
      {user ? (

        user.role === 'admin' ? ( // Only allow admin users to access the admin dashboard
          <>
            <Box  sx={{textAlign: 'center',marginBottom: 3,marginTop: 2,}}>

              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
              <Typography variant="h6" sx={{ color: '#555' }}>Welcome, {user.first_name}  {user.last_name}!</Typography> {/* Assuming user object has a 'name' field */}

              <Typography variant="body1" sx={{ color: '#777' }}>Manage all available vacations:</Typography>

              {/* Button for adding new vacation */}
              <Button
                variant="contained"
                color="success"
                sx={{ marginBottom: 2 }}
                onClick={() => navigate("/add-vacation")} // Navigate to add vacation page
              >
                Add New Vacation
              </Button>
              <Button
                variant="contained"
                color="warning"
                sx={{ marginBottom: 2 }}
                onClick={() => navigate("/whatch-report")} // Navigate to add vacation page
              >
                whatch report
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // Set 3 cards per row
                gap: 2,
                gridAutoRows: 'auto', // Allow flexible height for cards based on content
              }}
            >
              {vacations.map((vacation) => (
                <Card key={vacation.ID} sx={{
                  width: "100%",
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#dddddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  minHeight: '400px',
                }}>
                  {/* Part for the image */}
                  <Box sx={{
                    height: '200px',
                    backgroundImage: `url(http://localhost:3030/images/${vacation.img_name})`,
                    backgroundSize: "cover",
                    backgroundPosition: 'center',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }} />

                  {/* Content below the image */}
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 10
                    }}>
                      <Typography variant="h5" sx={{ textTransform: 'capitalize', fontSize: '1.75rem', textAlign: 'center', color: 'white', marginTop: '100px' }}>
                        {vacation.vacation_destination}
                      </Typography>
                    </Box>

                    {/* Dates in center */}
                    <Box sx={{
                      backgroundColor: '#89CFF0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 2,
                      height: '50px',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px'
                    }}>
                      <Typography variant="body2" sx={{ marginRight: 2 }}>
                        Start date: {formatDate(vacation.vacation_start_date)}
                      </Typography>
                      <Typography variant="body2">
                        End date: {formatDate(vacation.vacation_end_date)}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ marginBottom: 2, flexGrow: 1 }}>
                      {vacation.vacation_Description}
                    </Typography>

                    {/* Buttons for Edit and Delete */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/edit-vacation/${vacation.ID}`)} // Navigate to edit vacation page
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteVacation(vacation.ID)} // Handle vacation deletion
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Pagination controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Typography sx={{ margin: '0 20px' }}>Page {page} of {totalPages}</Typography>
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6">You do not have permission to access the admin dashboard.</Typography>
        )
      ) : (
        <Typography variant="h6">You are not logged in.</Typography>
      )}
    </Box>
  );
};

export default AdminDashboard;