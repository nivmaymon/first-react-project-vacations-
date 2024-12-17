import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns'; 
import './Vacations.css';

const Vacations = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [vacations, setVacations] = useState([]); // State for vacations
  const [likedVacations, setLikedVacations] = useState({}); // State for tracking user likes
  const [page, setPage] = useState(1); // State for tracking the current page
  const [totalVacations, setTotalVacations] = useState(0); // State for tracking the total number of vacations
  const [filterLiked, setFilterLiked] = useState(false); // State to track whether to filter by liked vacations
  const [filterNotStarted, setFilterNotStarted] = useState(false); // State for "Not Started" filter
  const [filterCurrent, setFilterCurrent] = useState(false); // State for current vacation filter

  // Date formatting function using date-fns
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy'); // Formats the date as "day/month/year"
  };
  
  const hasStarted = (startDate) => {
    const currentDate = new Date();
    const vacationStartDate = new Date(startDate);
    return vacationStartDate <= currentDate;
  };

  const isCurrentlyHappening = (startDate, endDate) => {
    const currentDate = new Date();
    const vacationStartDate = new Date(startDate);
    const vacationEndDate = new Date(endDate);
    return vacationStartDate <= currentDate && vacationEndDate >= currentDate;
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/signin"); // Redirect to signin if user is not logged in
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "User") {
        navigate("/SignIn");
      }
      setUser(JSON.parse(userData));

      // Fetch vacations data with pagination
      axios.get("http://localhost:3030/api/vacations/", { params: { page, limit: 10 } })
        .then(response => {
          if (Array.isArray(response.data.vacations)) {
            setVacations(response.data.vacations); // Store vacations data
            setTotalVacations(response.data.totalVacations); // Set the total number of vacations for pagination
          } else {
            console.error("Vacations data is not an array", response.data);
            setVacations([]); // Fallback to empty array
          }
        })
        .catch(error => console.error("Error fetching vacations:", error));
    }
  }, [navigate, page]);

  useEffect(() => {
    // Fetch the number of likes for each vacation after vacations are loaded
    if (vacations.length > 0 && user) {
      vacations.forEach(vacation => {
        axios.get(`http://localhost:3030/api/vacations/${vacation.ID}/liked`, {
          params: { userId: user.ID }
        })
          .then(response => {
            setLikedVacations(prevState => ({
              ...prevState,
              [vacation.ID]: {
                likeCount: response.data.like_count, // Set the like count
                liked: response.data.liked // Set if the user liked it
              }
            }));
          })
          .catch(error => console.error("Error fetching like status:", error));
      });
    }
  }, [vacations, user]);

  // Handle like/unlike functionality
  const handleLike = (vacationId) => {
    if (user) {
      const userId = user.ID;

      // Toggle like
      axios.post(`http://localhost:3030/api/vacations/${vacationId}/like`, { userId })
        .then(response => {
          setLikedVacations(prevState => {
            const currentLikeState = prevState[vacationId];
            return {
              ...prevState,
              [vacationId]: {
                likeCount: response.data.likeCount,  // Update like count
                liked: !currentLikeState.liked  // Toggle like status
              }
            };
          });
        })
        .catch(error => console.error("Error toggling like:", error));
    }
  };

  // Calculate total pages based on the total number of vacations
  const totalPages = Math.ceil(totalVacations / 10);

  const filteredVacations = vacations.filter(vacation => {
    if (filterNotStarted && hasStarted(vacation.vacation_start_date)) {
      return false;
    }
    if (filterLiked && !likedVacations[vacation.ID]?.liked) {
      return false;
    }
    if (filterCurrent && !isCurrentlyHappening(vacation.vacation_start_date, vacation.vacation_end_date)) {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    // Remove the user information from localStorage
    localStorage.removeItem("user");

    // Update the user state
    setUser(null);

    // Redirect to sign-in page
    navigate("/signin");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="outlined" onClick={handleLogout}>Log Out</Button>
      {user ? (
        <>
          <Typography variant="h4">Welcome, {user.first_name}    {user.last_name}!</Typography>
          <Typography variant="h6">Here are all the available vacations for you :</Typography>
          
          {/* Filter options */}
          <FormControlLabel
            control={
              <Checkbox
                checked={filterLiked}
                onChange={() => setFilterLiked(!filterLiked)}
                color="primary"
              />
            }
            label="Show only liked vacations"
          />
           {/* Checkbox to filter only vacations that haven't started yet */}
           <FormControlLabel
            control={
              <Checkbox
                checked={filterNotStarted}
                onChange={() => setFilterNotStarted(!filterNotStarted)}
                color="primary"
              />
            }
            label="Show only vacations not started yet"
          />

            {/* New filter for current vacations */}
            <FormControlLabel
            control={
              <Checkbox
                checked={filterCurrent}
                onChange={() => setFilterCurrent(!filterCurrent)}
                color="primary"
              />
            }
            label="Show only current vacations"
          />
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // Set 3 cards per row
              gap: 2,
              gridAutoRows: 'auto', // Allow flexible height for cards based on content
            }}
          >
            {filteredVacations.map((vacation) => (
              <Card key={vacation.ID} sx={{
                width: "100%",
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#dddddd',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                minHeight: '400px', // Gave each card a consistent minimum height
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
                  justifyContent: 'space-between', // This ensures elements are spaced evenly within the card
                }}>
                  {/* Like Button */}
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 10
                  }}>
                    <Button
                      variant="contained"
                      color={likedVacations[vacation.ID]?.liked ? 'error' : 'default'}
                      onClick={() => handleLike(vacation.ID)}
                      sx={{
                        borderRadius: '50%',
                        padding: '8px',
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: likedVacations[vacation.ID]?.liked ? '#f48fb1' : '#eeeeee',
                          color: likedVacations[vacation.ID]?.liked ? 'white' : 'black',
                        },
                      }}
                    >
                      {likedVacations[vacation.ID]?.liked ? '❤️' : '♡'}
                      <Typography >Likes: {likedVacations[vacation.ID]?.likeCount || 0}</Typography> {/* Displaying the like count */}
                    </Button>
                    <Typography variant="h5" sx={{ textTransform: 'capitalize', fontSize: '1.75rem', textAlign: 'center', color:'white', marginTop:'100px' }}>
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
                    height:'50px',
                    borderTopLeftRadius:'10px',
                    borderTopRightRadius:'10px'
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

                  {/* Button for more info */}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      alignSelf: 'center',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${vacation.price}
                  </Button>
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
        <Typography variant="h6">You are not logged in.</Typography>
      )}
    </Box>
  );
};

export default Vacations;