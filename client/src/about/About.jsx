// client/src/about/About.jsx
import React, { useEffect } from "react";
import { Container, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

import "./about.css";
import Navbar from "../navbar/Navbar";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container">
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to BingeQuest, your ultimate destination for discovering and managing movies and TV shows. Our website is dedicated to providing you with a comprehensive and engaging media experience.
          </Typography>
          <Typography variant="body1" paragraph>
            With BingeQuest, you can:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Explore Popular Movies and TV Shows"
                secondary="Stay up-to-date with the latest popular titles trending in the film and television industry."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Discover Trending Titles"
                secondary="Find out what's currently trending and making waves in the world of cinema and TV."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="View Top-Rated Films and Shows"
                secondary="Check out the highest-rated movies and TV shows based on user ratings and reviews."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Find Upcoming Releases"
                secondary="Get a glimpse of movies and TV shows that are about to hit theaters or premiere on TV."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Search for Movies and TV Shows"
                secondary="Easily search for your favorite titles by name, genre, or release year."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Track Your Watchlist"
                secondary="Manage your personal watchlist by marking movies and shows as 'Watching', 'Completed', 'Plan to Watch', 'On Hold', or 'Dropped'."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Get Recommendations"
                secondary="Receive personalized recommendations based on your interests and viewing history."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Watch Trailers and Clips"
                secondary="Access video trailers and clips to get a sneak peek of upcoming movies and TV shows."
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            Our mission is to enhance your media-watching experience by offering an easy-to-use platform that brings together movie and TV show discovery and personal tracking. Whether you're a casual viewer or a dedicated fan, BingeQuest is here to help you stay connected with the latest in entertainment.
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for visiting BingeQuest. If you have any feedback or suggestions, feel free to reach out to us.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Disclaimer:</strong> BingeQuest is an independent platform and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any specific movie studios, <strong>TMDB</strong>, TV networks, or other media entities. All trademarks, service marks, and company names are the property of their respective owners.
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default About;
