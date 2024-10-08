import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';

const routes = [
  { path: '/course-comparison', name: 'Course Comparison' },
];

const Homepage = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        {routes.map((route) => (
          <Grid item xs={12} sm={6} md={4} key={route.path}>
            <Card>
              <CardActionArea component={Link} to={route.path}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {route.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Homepage;