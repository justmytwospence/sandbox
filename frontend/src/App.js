import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CourseComparison from './components/CourseComparison';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Profile from './components/Profile';
import Activities from './components/Activities';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/course-comparison" element={<CourseComparison />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/activities" element={ <Activities /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
