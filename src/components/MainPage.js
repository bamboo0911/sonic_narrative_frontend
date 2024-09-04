import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [hasWritten, setHasWritten] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [textData, setTextData] = useState('');
  const [photoData, setPhotoData] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const writtenStatus = localStorage.getItem('hasWritten');
    const photoStatus = localStorage.getItem('hasPhoto');
    const storedText = localStorage.getItem('textData');
    const storedPhoto = localStorage.getItem('photoData');

    if (writtenStatus && storedText) {
      setHasWritten(true);
      setTextData(storedText);
    }

    if (photoStatus && storedPhoto) {
      setHasPhoto(true);
      setPhotoData(storedPhoto);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, (error) => {
        console.error("Error fetching geolocation: ", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSubmitToAI = () => {
    const data = { text: textData, photo: photoData };
    if (!data.text || !data.photo) {
        console.error('No text or photo data to submit');
        return;
    }

    console.log('Submitting data to API:', data);

    fetch('http://localhost:8080/api/generate-poem', { // 确认端点路径
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        console.log("Response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Generated text:", result.generatedText);
        localStorage.removeItem('textData');
        localStorage.removeItem('hasWritten');
        localStorage.removeItem('hasPhoto');
        localStorage.removeItem('photoData');
        setHasWritten(false);
        setHasPhoto(false);
        setTextData('');
        setPhotoData('');
        navigate('/ai-result');
    })
    .catch(error => {
        console.error('Error submitting to AI:', error);
    });
};


  return (
    <div>
      <h1>Main Page</h1>
      <p>Your current location is:</p>
      <p>Latitude: {location.latitude ? location.latitude : "Fetching..."}</p>
      <p>Longitude: {location.longitude ? location.longitude : "Fetching..."}</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/photo">
          <button style={{ backgroundColor: hasPhoto ? 'green' : 'blue' }}>
            {hasPhoto ? 'Photo Uploaded' : 'Take Photo'}
          </button>
        </Link>
        {hasPhoto && photoData && (
          <div style={{ marginTop: '10px' }}>
            <img src={photoData} alt="Uploaded" style={{ width: '100%', maxWidth: '400px' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/writing">
          <button style={{ backgroundColor: hasWritten ? 'green' : 'blue' }}>
            {hasWritten ? 'Writing Completed' : 'Start Writing'}
          </button>
        </Link>
        {hasWritten && (
          <div style={{ marginTop: '10px', color: 'green' }}>
            <p>{textData}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmitToAI}>Submit to AI</button>
      </div>
    </div>
  );
};

export default MainPage;
