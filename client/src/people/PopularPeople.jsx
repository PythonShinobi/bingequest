// client/src/popular/PopularPeople.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  Stack,
  Skeleton,
  Pagination,
  Fab,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./PopularPeople.css";
import Navbar from "../navbar/Navbar";

// Define a function to scale popularity to a star rating (optional)
const getPopularityRating = (popularity) => {
  return Math.min(5, popularity / 20); // Scale from 0-100 to 0-5 stars
};

const PopularPeople = () => {
  const [people, setPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const fetchPopularPeople = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/people/popular", {
        params: { page },
      });
      setPeople(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching popular people:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularPeople(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage, fetchPopularPeople]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const memoizedPeople = useMemo(
    () =>
      people.map((person) => (
        <Grid item xs={12} sm={6} md={3} key={person.id}>
          <Card>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name}
              height="450"
            />
            <CardContent>
              <Typography variant="h6">{person.name}</Typography>
              <Typography variant="body2">{person.known_for_department}</Typography>              
              <Rating
                value={getPopularityRating(person.popularity)}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2">
                Popularity: {person.popularity}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )),
    [people]
  );

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="people-container">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ marginTop: "100px", marginBottom: "30px" }}
        >
          Popular People
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {loading
            ? Array.from(new Array(20)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={450} />
                    <CardContent>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : memoizedPeople}
        </Grid>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ marginTop: "20px" }}
        >
          <Button
            variant="contained"
            onClick={() => handlePageChange(null, currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            siblingCount={0}
            boundaryCount={1}
            shape="rounded"
            size="small"
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={() => handlePageChange(null, currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </Stack>

        {/* Back to Top Button */}
        {showBackToTop && (
          <div className="back-to-top">
            <Fab color="primary" size="large" onClick={handleScrollToTop}>
              <KeyboardArrowUpIcon />
            </Fab>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularPeople;