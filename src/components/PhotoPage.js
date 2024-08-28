import React, { useState } from 'react';
import '../App.css';  // 确保引入了App.css

const PhotoPage = () => {
  const [photo, setPhoto] = useState(null); // 用来存储已上传或拍摄的照片

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]; // 获取选中的文件（照片）
    if (file) {
      const reader = new FileReader(); // 创建FileReader对象来读取文件
      reader.onloadend = () => {
        setPhoto(reader.result); // 将读取的照片（Base64 URL）设置为photo状态
      };
      reader.readAsDataURL(file); // 读取文件内容并转换为Data URL
    }
  };

  const handleChooseAnotherPhoto = () => {
    setPhoto(null); // 清空photo状态，允许重新选择照片
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
          <button>Send</button> {/* SEND按钮，功能尚未实现 */}
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
