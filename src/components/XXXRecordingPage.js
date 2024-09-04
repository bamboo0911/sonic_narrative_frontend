import React, { useState, useRef } from 'react';
import '.././App.css';  // 確保引入了App.css

// 定義RecordingPage組件
const RecordingPage = () => {
  const [isRecording, setIsRecording] = useState(false); // 用來指示是否正在錄音
  const [audioURL, setAudioURL] = useState(''); // 用來存儲錄音完成後的音頻URL
  const [timeLeft, setTimeLeft] = useState(30); // 用來控制錄音的倒數計時，初始化為30秒
  const mediaRecorderRef = useRef(null); // 用於存放MediaRecorder對象的引用
  const timeoutRef = useRef(null); // 用於存放錄音時間限制的計時器引用
  const intervalRef = useRef(null); // 用於存放倒數計時的計時器引用

  // 開始錄音功能
  const startRecording = () => {
    setIsRecording(true); // 將錄音狀態設置為true，表示開始錄音
    setTimeLeft(30); // 重置倒數計時為30秒
    
    // 請求用戶的音頻媒體（麥克風）
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // 創建一個MediaRecorder對象來記錄音頻
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start(); // 開始錄音
        const audioChunks = []; // 用來存放錄音片段的數組

        // 當有音頻數據可用時，將其加入到audioChunks數組中
        mediaRecorderRef.current.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        // 當錄音停止時，將錄音片段合併為一個Blob，並生成URL
        mediaRecorderRef.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks); // 創建音頻Blob
          const audioUrl = URL.createObjectURL(audioBlob); // 為Blob生成URL
          setAudioURL(audioUrl); // 將生成的URL保存到狀態中
        });

        // 設置一個計時器，30秒後自動停止錄音
        timeoutRef.current = setTimeout(() => {
          stopRecording(); // 調用stopRecording函數來停止錄音
        }, 30000); // 30000毫秒 = 30秒
      })
      .catch(error => {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          alert('Please allow microphone access to use the recording feature.');
        } else {
          console.error('Error accessing microphone: ', error);
        }
      });

    // 每秒更新一次倒數計時
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1) {
          return prev - 1; // 每次減少1秒
        } else {
          clearInterval(intervalRef.current); // 如果計時器結束，清除計時器
          return 0; // 計時器歸零
        }
      });
    }, 1000); // 每1000毫秒 = 1秒
  };

  // 停止錄音功能
  const stopRecording = () => {
    setIsRecording(false); // 將錄音狀態設置為false，表示停止錄音
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop(); // 停止錄音
    }
    clearTimeout(timeoutRef.current); // 清除時間限制計時器
    clearInterval(intervalRef.current); // 清除倒數計時計時器
  };

  return (
    <div>
      <h1>Recording Page</h1>

      {/* 錄音狀態指示，當錄音中時顯示紅色圓點和倒數計時 */}
      {isRecording && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          <span style={{ marginRight: '10px', animation: 'blink 1s infinite' }}>
            ● {/* 紅色圓點，使用CSS動畫來實現閃爍效果 */}
          </span>
          Recording... {timeLeft} seconds left {/* 顯示剩餘錄音時間 */}
        </div>
      )}

      {/* 錄音控制按鈕 */}
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      {/* 當錄音中時，禁用開始按鈕 */}
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      {/* 當未錄音時，禁用停止按鈕 */}

      {/* 錄音完成後的音頻回放 */}
      {audioURL && <audio src={audioURL} controls />}
      {/* 當有音頻URL時顯示音頻播放器 */}

      {/* Send 按鈕 */}
      {audioURL && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => alert("Send button clicked! (functionality pending)")} disabled={isRecording}>
            Send
          </button>
          {/* 當有音頻URL且未錄音時顯示Send按鈕，目前按鈕的功能是顯示一個提示框 */}
        </div>
      )}

      {/* 返回主頁按鈕 */}
      <div style={{ marginTop: '20px' }}>
        <a href="/">
          <button>Back to Main Page</button>
        </a>
      </div>
    </div>
  );
};

// 添加CSS動畫，用於實現紅色圓點的閃爍效果
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
`;
document.getElementsByTagName('head')[0].appendChild(style);

export default RecordingPage;
