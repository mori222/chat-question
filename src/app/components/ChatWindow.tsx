"use client"

import '../../styles/css/chat-window.css';
import { useState } from 'react';
import InputField from './InputField';
import Result from './Result';
import { questions } from '../../utils/questions';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const addMessage = (option: string) => {
        setMessages([...messages, { text: option, sender: 'user' }]);
        const botResponse = questions[currentQuestionIndex].question;
        setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        setSelectedOptions(prev => [...prev, option]);
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        addMessage(option);
    };

    return (
        <div className="chat-window">
            {currentQuestionIndex < questions.length ? (
                <InputField 
                    question={questions[currentQuestionIndex]}
                    selectedOption={selectedOption}
                    handleOptionChange={handleOptionChange}
                    previousQuestions={questions.slice(0, currentQuestionIndex)}
                    selectedOptions={selectedOptions}
                />
            ) : (
                <div className="input_field">
                    {/* 過去の質問をすべて表示 */}
                    {questions.map((prevQuestion, index) => (
                        <div key={index} className="previous_question">
                        <div className="bot_wrap">
                            <figure>
                                <img src="/images/bot_icon.svg" alt="ボット" />
                            </figure>
                            <p className='question'>{prevQuestion.question}</p>
                        </div>
                        <div className="option_wrap">
                            <div className='button'>
                                    <input
                                        type="radio"
                                        id={`${index}-${selectedOptions[index]}`}
                                        checked={true}
                                        disabled
                                    />
                                    <label className='selected_option'>{selectedOptions[index]}</label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Result />
                </div>
            )}
        </div>
    );
};

export default ChatWindow;