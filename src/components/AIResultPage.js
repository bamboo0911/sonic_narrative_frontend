import React, { useEffect, useState } from 'react';

const AIResultPage = () => {
    const [generatedText, setGeneratedText] = useState('');
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        const fetchGeneratedText = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/latest-result'); // 确保路径正确
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setGeneratedText(data.generatedText);
            } catch (error) {
                console.error('Error fetching the generated text:', error);
                setGeneratedText('Error: Could not load AI generated text.');
            }
        };
    
        fetchGeneratedText();
    }, []);
    useEffect(() => {
        if (generatedText) {
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText((prev) => prev + generatedText[index]);
                index++;
                if (index >= generatedText.length) clearInterval(interval);
            }, 50); // 每个字的显示间隔

            return () => clearInterval(interval);
        }
    }, [generatedText]);

    return (
        <div className="container">
            <h1>AI Generated Content</h1>
            <p>{displayedText}</p>
        </div>
    );
};

export default AIResultPage;
