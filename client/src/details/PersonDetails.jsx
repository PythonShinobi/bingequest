// client/src/details/PersonDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Alert,
  Grid,
  Skeleton,
  Box
} from "@mui/material";

import Navbar from "../navbar/Navbar";

// Cache Object
const cacheObject = {
  celebrityDetails: {},
};

const CelebrityDetails = () => {
  const { personId } = useParams(); // Get personId from URL params
  const [celebrity, setCelebrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCelebrityDetails = async () => {
      setLoading(true);
      if (cacheObject.celebrityDetails[personId]) {
        setCelebrity(cacheObject.celebrityDetails[personId]);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/people/${personId}`);
        // Cache the data
        cacheObject.celebrityDetails[personId] = response.data;
        setCelebrity(response.data);
      } catch (error) {
        setError("We are having trouble loading celebrity details. Please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrityDetails();
  }, [personId]);

  if (loading) return (
    <Container sx={{ marginTop: '90px', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
      <Box sx={{ width: { xs: '100%', sm: 300 }, height: 450 }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
      <Box sx={{ flex: 1, paddingLeft: { sm: '20px' }, marginTop: { xs: '20px', sm: 0 } }}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={20} sx={{ marginTop: '10px' }} />
        <Skeleton variant="text" width="100%" height={100} sx={{ marginTop: '10px' }} />
      </Box>
    </Container>
  );
  
  if (error) return <Alert
                      severity="error" 
                      sx={{ 
                        width: '100%', 
                        maxWidth: '600px', 
                        wordBreak: 'break-word' 
                      }}
                    >{error}</Alert>;

  return (
    <div>
      <Navbar />
      <Container sx={{ marginTop: '90px' }}>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', padding: '20px' }}>
          <CardMedia
            component="img"
            image={`https://image.tmdb.org/t/p/w500${celebrity.profile_path}`}
            alt={celebrity.name}
            sx={{ width: { xs: '100%', sm: 300 }, height: 450, objectFit: 'cover', borderRadius: 2 }}
          />
          <CardContent sx={{ flex: 1, paddingLeft: { sm: '20px' }, marginTop: { xs: '20px', sm: 0 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {celebrity.name}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Known For: {celebrity.known_for_department}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              {celebrity.biography || 'No biography available.'}
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Birthday:</strong> {celebrity.birthday || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Place of Birth:</strong> {celebrity.place_of_birth || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Popularity:</strong> {celebrity.popularity || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default CelebrityDetails;