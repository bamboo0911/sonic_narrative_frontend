import React, { useState } from 'react';
import '../App.css';  // 确保引入了App.css

const WritingPage = () => {
  const [text, setText] = useState(''); // 用于存储用户输入的文字
  const [submittedText, setSubmittedText] = useState(null); // 用于存储提交后的文字

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    setSubmittedText(text); // 将输入的文字设置为已提交状态
    setText(''); // 清空文本框
    localStorage.setItem('hasWritten', 'true'); // 在本地存储中标记为已写入
    localStorage.setItem('textData', text); // 在本地存储中保存输入的文本数据
  };

  return (
    <div>
      <h1>Writing Page</h1>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter your text here..."
        rows="10"
      />

      <div>
        <button onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {submittedText && (
        <div>
          <h2>Submitted Text:</h2>
          <p>{submittedText}</p>
        </div>
      )}

      <div>
        <a href="/">
          <button>
            Back to Main Page
          </button>
        </a>
      </div>
    </div>
  );
};

export default WritingPage;
