import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';
import '../App.css';

const PhotoPage = () => {
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6, // 壓縮質量調整為 0.6
        success(result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const photoData = reader.result;
            setPhoto(photoData);
            try {
              localStorage.setItem('photoData', photoData);
            } catch (error) {
              console.error('Error setting item in localStorage:', error);
            }
          };
          reader.readAsDataURL(result);
        },
        error(err) {
          console.error('Compression failed:', err.message);
        },
      });
    }
  };

  const handleChooseAnotherPhoto = () => {
    setPhoto(null);
    localStorage.removeItem('photoData');
  };

  const handleSendPhoto = () => {
    localStorage.setItem('hasPhoto', 'true');
    navigate('/');
  };

  return (
    <div>
      <h1>Photo Page</h1>

      {!photo && (
        <div>
          <label htmlFor="upload-button" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
            Upload Photo
          </label>
          <input
            id="upload-button"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
        </div>
      )}

      {photo && (
        <div style={{ marginTop: '20px' }}>
          <img src={photo} alt="Uploaded" style={{ width: '100%', maxWidth: '400px' }} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleChooseAnotherPhoto}>Choose Another Photo</button>
          </div>
        </div>
      )}

      {photo && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSendPhoto}>Send</button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <a href="/">
          <button>Back to Main Page</button>
        </a>
      </div>
    </div>
  );
};

export default PhotoPage;
