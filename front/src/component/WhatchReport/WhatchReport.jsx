import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const WatchReport = () => {
  const [vacationsData, setVacationsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);  // To track if the user is an admin


  // Fetch data when the component mounts
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/signin"); // Redirect to sign-in if no user is found
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        navigate("/signin"); // Redirect to sign-in if the user is not an admin
      } else {
        setIsAdmin(true); // If the user is admin, set isAdmin to true
      }
    }
    // Fetch vacation data and likes count from the API
    axios.get('http://localhost:3030/api/chart')  // Update with your correct endpoint
      .then((response) => {
        const vacations = response.data.vacations; // Assuming this is the list of vacations
        const vacationNames = vacations.map((vacation) => vacation.vacation_destination);  // Extract vacation names
        const likeCounts = vacations.map((vacation) => vacation.like_count);  // Extract like counts

        setVacationsData(vacationNames);
        setLikesData(likeCounts);
      })
      .catch((error) => {
        console.error("Error fetching vacation data:", error);
      });
  }, [navigate]);

  // Define a color for all the bars (light blue)
  const lightBlueColor = '#ADD8E5'; // Light blue color

  const handleBack = ()=>{
    navigate('/admin-dashboard')
  }


  const handleDownloadCSV = () => {
    const headers = ['Vacation Destination', 'Like Count'];
    const rows = vacationsData.map((vacation, index) => [vacation, likesData[index]]);

    // Convert the data into CSV format
    const csvContent = [
      headers.join(','), // Add header row
      ...rows.map(row => row.join(',')), // Add data rows
    ].join('\n');

    // Create a Blob object and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vacations_report.csv'; // The name of the downloaded file
    a.click(); // Trigger the download
    URL.revokeObjectURL(url); // Clean up the URL object
  };


  return (
    <Box sx={{ 
      marginTop: 3, 
      overflowX: 'auto', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', // Center the content horizontally
      justifyContent: 'center', // Center the content vertically
      height: '100vh', // Full viewport height for vertical centering
    }}>
      <h1>Vacation Report</h1>
      <Button style={{marginBottom:"40px"}} onClick={handleBack} variant='outlined'>GO BACK</Button>

 {isAdmin && (
        <Button  onClick={handleDownloadCSV} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          Download CSV
        </Button>
      )}

      
      
      <BarChart
       xAxis={[
        {
          id: 'vacationNames',
          data: vacationsData,
          scaleType: 'band',
          axisLabel: {
            angle: -45, // Rotate labels
            fontSize: 8, // Even smaller font size to avoid overflow
            textAnchor: 'middle', // Center-align the text
            dy: 5, // Vertical shift (optional)
          },
          tickLabel: {
            fontSize: 8, // Smaller font size for the labels
            angle: -45, // Rotating the labels at an angle
            textAnchor: 'middle', // Center the text horizontally
            dy: 5, // Adjust vertical positioning to avoid overlap
            style: { 
              textOverflow: 'ellipsis', // Prevent the text from overflowing
              whiteSpace: 'nowrap', // Prevent wrapping, handle long text with ellipsis
              overflow: 'hidden', // Hide overflowed text
            },
          }
        },
      ]}
        yAxis={[
          {
            id: 'likeCounts',
            data: likesData,
          },
        ]}
        series={[
          {
            data: likesData,
            color: lightBlueColor, // Set the color for all bars to light blue
          },
        ]}
        width={1000}  // Increase the width
        height={300}
      />
    </Box>
  );
};

export default WatchReport;
