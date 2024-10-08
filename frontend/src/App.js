import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseComparison from './components/CourseComparison'; 
import Homepage from './components/Homepage';
import CourseUploader from './components/Courses';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/course-comparison" element={<CourseComparison />} />
          <Route path="/courses" element={<CourseUploader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
