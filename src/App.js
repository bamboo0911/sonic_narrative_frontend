import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import RecordingPage from './components/RecordingPage';
import PhotoPage from './components/PhotoPage';
import WritingPage from './components/WritingPage';
import AIResultPage from './components/AIResultPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recording" element={<RecordingPage />} />
        <Route path="/photo" element={<PhotoPage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/ai-result" element={<AIResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
