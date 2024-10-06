import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Topbar from './components/Topbar';
import Logo from './components/Dashboard';
import CourseComparison from './components/CourseComparison'; // Assuming you have this component

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Logo />} />
            <Route path="/course-comparison" element={<CourseComparison />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
