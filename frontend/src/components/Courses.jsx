import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CourseUploader = () => {
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:8000/api/upload-gpx/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchCourses();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get-courses/');
      setCourses(response.data.features);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload GPX
      </Button>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {course.properties.name}
                </Typography>
                <MapContainer
                  style={{ height: '200px', width: '100%' }}
                  center={[51.505, -0.09]}
                  zoom={13}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <GeoJSON data={course.geometry} />
                </MapContainer>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CourseUploader;