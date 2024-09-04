import React, { useState, useRef, useEffect } from 'react';

const AIResultPage = () => {
    const [generatedText, setGeneratedText] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [voice, setVoice] = useState('alloy');
    const [speed, setSpeed] = useState(1.0);
    const [audioSrc, setAudioSrc] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // 用来指示是否正在录音
    const [timeLeft, setTimeLeft] = useState(30); // 用来控制录音的倒数计时，初始化为30秒
    const mediaRecorderRef = useRef(null); // 用于存放MediaRecorder对象的引用
    const timeoutRef = useRef(null); // 用于存放录音时间限制的计时器引用
    const intervalRef = useRef(null); // 用于存放倒数计时的计时器引用

    useEffect(() => {
        const fetchGeneratedText = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/latest-result');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('AI generated text:', data.generatedText);
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
            }, 50);

            return () => clearInterval(interval);
        }
    }, [generatedText]);

    const handleGenerateAudio = async () => {
        setButtonClicked(true);
        try {
            const response = await fetch('http://localhost:8080/api/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: generatedText, voice, speed }),
            });

            const result = await response.json();
            if (response.ok) {
                setAudioSrc('data:audio/mp3;base64,' + result.audioContent);
            } else {
                console.error('Error generating audio:', result.error);
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setButtonClicked(true);
        setTimeLeft(30);

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.start();
                const audioChunks = [];

                mediaRecorderRef.current.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorderRef.current.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioSrc(audioUrl);
                });

                timeoutRef.current = setTimeout(() => {
                    stopRecording();
                }, 30000);

                intervalRef.current = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev > 1) {
                            return prev - 1;
                        } else {
                            clearInterval(intervalRef.current);
                            return 0;
                        }
                    });
                }, 1000);
            })
            .catch(error => {
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    alert('Please allow microphone access to use the recording feature.');
                } else {
                    console.error('Error accessing microphone: ', error);
                }
            });
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);
    };

    const handleSendBack = () => {
        console.log("Send back to C-lab logic to be implemented");
    };

    return (
        <div className="container">
            <h1>AI Generated Content</h1>
            <p>{displayedText}</p>

            <div>
                <label htmlFor="voiceSelect">Choose a voice:</label>
                <select id="voiceSelect" value={voice} onChange={(e) => setVoice(e.target.value)} disabled={buttonClicked}>
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                </select>
            </div>

            <div>
                <label htmlFor="speedInput">Select speed (0.5 to 2.0): <span>{speed}</span></label>
                <input 
                    type="range" 
                    id="speedInput" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1" 
                    value={speed} 
                    onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                    disabled={buttonClicked}
                />
            </div>

            {isRecording && (
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                    <span style={{ marginRight: '10px', animation: 'blink 1s infinite' }}>
                        ●
                    </span>
                    Recording... {timeLeft} seconds left
                </div>
            )}

            {!buttonClicked && (
                <>
                    <div>
                        <button onClick={handleGenerateAudio} disabled={!generatedText}>Generate Audio</button>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
                    </div>
                </>
            )}

            {isRecording && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={stopRecording}>Stop Recording</button>
                </div>
            )}

            {buttonClicked && !isRecording && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleSendBack}>Send Back to C-lab</button>
                </div>
            )}

            {audioSrc && <audio src={audioSrc} controls style={{ marginTop: '20px' }} />}
        </div>
    );
};

// 添加CSS动画，用于实现红色圆点的闪烁效果
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

export default AIResultPage;
