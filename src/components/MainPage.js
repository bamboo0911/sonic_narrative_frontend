import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [hasWritten, setHasWritten] = useState(false); // 用于跟踪 Writing Page 的状态
  const [textData, setTextData] = useState(''); // 用于存储写作页面的文本
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户是否在 Writing Page 中输入了数据
    const writtenStatus = localStorage.getItem('hasWritten');
    const storedText = localStorage.getItem('textData'); // 获取文本数据

    if (writtenStatus && storedText) {
      setHasWritten(true);
      setTextData(storedText); // 将文本数据保存到状态中
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
    const data = textData; // 使用存储的文本数据
    if (!data) {
      console.error('No text data to submit');
      return;
    }

    fetch('http://localhost:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: data }), // 发送文本数据到后端
    })
    .then(response => {
      console.log("Response received:", response);
      return response.json();
    })
    .then(result => {
      console.log("Generated text:", result.generatedText);
      localStorage.removeItem('textData'); // 清空文本数据
      localStorage.removeItem('hasWritten'); // 清空已写入的标志
      setHasWritten(false); // 更新状态
      setTextData(''); // 清空文本数据状态
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
        <Link to="/recording">
          <button>Start Recording</button>
        </Link>
      </div>
  
      <div style={{ marginTop: '20px' }}>
        <Link to="/photo">
          <button>Take Photo</button>
        </Link>
      </div>
  
      <div style={{ marginTop: '20px' }}>
        <Link to="/writing">
          <button style={{ backgroundColor: hasWritten ? 'green' : 'blue' }}>
            {hasWritten ? 'Writing Completed' : 'Start Writing'}
          </button>
        </Link>
        {hasWritten && (
          <div style={{ marginTop: '10px', color: 'green' }}>
            <p>{textData}</p> {/* 显示输入的文本 */}
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
