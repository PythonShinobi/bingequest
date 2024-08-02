import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Grid   
} from "@mui/material";

const SeriesFilterComponent = ({ onApplyFilters, sortOptions }) => {
  const [language, setLanguage] = useState("en-US");
  const [sort_by, setSortBy] = useState(sortOptions[0]?.value); // Use first option or default value
  const [include_adult, setIncludeAdult] = useState("false");
  const [first_air_date_year, setFirstAirDateYear] = useState("");
  const [first_air_date_gte, setFirstAirDateGte] = useState("");
  const [first_air_date_lte, setFirstAirDateLte] = useState("");
  const [genres, setGenres] = useState([]);
  const [with_genres, setWithGenres] = useState([]); // Changed to array

  useEffect(() => {
    // Fetch genres from the TMDb API
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.themoviedb.org/3/genre/tv/list", {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMmQyZmUzMzYwNzdlZWE2MDFhMTc3N2NkZGZiOWNkMSIsIm5iZiI6MTcyMjMzODY1OC4xMDI4MDMsInN1YiI6IjY1ZmE4ZjdhY2Y2MmNkMDE2MzU1NjRkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.55HfBBuCNoDNLLNRCNuvBe7g6L-349zcK57cyAlGEtI`  // Replace with your actual access token
          }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleApplyFilters = () => {
    onApplyFilters({
      language,
      sort_by,
      include_adult,
      first_air_date_year,
      first_air_date_gte,
      first_air_date_lte,
      with_genres,          
    });
  };  

  return (
    <Grid container spacing={2} style={{ padding: '16px' }}>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            label="Language"
          >
            <MenuItem value="en-US">English</MenuItem>
            <MenuItem value="es-ES">Spanish</MenuItem>
            <MenuItem value="fr-FR">French</MenuItem>
            <MenuItem value="de-DE">German</MenuItem>
            <MenuItem value="it-IT">Italian</MenuItem>
            <MenuItem value="ja-JP">Japanese</MenuItem>
            <MenuItem value="ko-KR">Korean</MenuItem>
            <MenuItem value="pt-PT">Portuguese</MenuItem>
            <MenuItem value="ru-RU">Russian</MenuItem>
            <MenuItem value="zh-CN">Chinese (Simplified)</MenuItem>
            <MenuItem value="ar-AE">Arabic</MenuItem>
            <MenuItem value="hi-IN">Hindi</MenuItem>
            <MenuItem value="tr-TR">Turkish</MenuItem>
            <MenuItem value="pl-PL">Polish</MenuItem>
            <MenuItem value="sv-SE">Swedish</MenuItem>
            <MenuItem value="nl-NL">Dutch</MenuItem>
            <MenuItem value="no-NO">Norwegian</MenuItem>
            <MenuItem value="da-DK">Danish</MenuItem>
            <MenuItem value="fi-FI">Finnish</MenuItem>
            <MenuItem value="cs-CZ">Czech</MenuItem>
            <MenuItem value="hu-HU">Hungarian</MenuItem>
            <MenuItem value="ro-RO">Romanian</MenuItem>
            <MenuItem value="sk-SK">Slovak</MenuItem>
            <MenuItem value="th-TH">Thai</MenuItem>
            <MenuItem value="vi-VN">Vietnamese</MenuItem>
            <MenuItem value="he-IL">Hebrew</MenuItem>
            <MenuItem value="ms-MY">Malay</MenuItem>
            <MenuItem value="id-ID">Indonesian</MenuItem>
            <MenuItem value="bg-BG">Bulgarian</MenuItem>
            <MenuItem value="hr-HR">Croatian</MenuItem>
            <MenuItem value="lt-LT">Lithuanian</MenuItem>
            <MenuItem value="lv-LV">Latvian</MenuItem>
            <MenuItem value="et-EE">Estonian</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort_by}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Include Adult</InputLabel>
          <Select
            value={include_adult}
            onChange={(e) => setIncludeAdult(e.target.value)}
            label="Include Adult"
          >
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="First Air Date Year"
          type="number"
          InputProps={{
            inputProps: { 
              min: 1900, // Optional: Adjust to your desired range
              max: 2100  // Optional: Adjust to your desired range
            }
          }}
          value={first_air_date_year}
          onChange={(e) => setFirstAirDateYear(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Genre</InputLabel>
          <Select
            value={with_genres}
            onChange={(e) => setWithGenres(e.target.value)}
            label="Genre"            
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>    
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="First Air Date GTE"
          placeholder="2020-09-15"
          value={first_air_date_gte}
          onChange={(e) => setFirstAirDateGte(e.target.value)}
          helperText="Series aired on or after this date."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="First Air Date LTE"
          placeholder="2023-09-15"
          value={first_air_date_lte}
          onChange={(e) => setFirstAirDateLte(e.target.value)}
          helperText="Series aired on or before this date."
        />
      </Grid>                  
      <Grid item xs={12} style={{ marginTop: '16px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApplyFilters}
          fullWidth
        >
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default SeriesFilterComponent;