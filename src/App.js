import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseComparison from './components/CourseComparison'; 
import Homepage from './components/Homepage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/course-comparison" element={<CourseComparison />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
