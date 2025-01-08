"use client"

import '../../styles/css/chat-window.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const getQuestionIndexById = (id: number): number => {
        return questions.findIndex(question => question.id === id);
    };

    const addMessage = async (option: string | Date | null) => {
        if (typeof option === 'string') {
            setMessages(prev => [...prev, { text: option, sender: 'user' }]);
        } else if (option instanceof Date) {
            setMessages(prev => [...prev, { text: option.toLocaleString(), sender: 'user' }]);
        }

        let nextQuestionIndex = currentQuestionIndex + 1;

        if (typeof option === 'string' && option === "その他お問い合わせ") {
            const targetIndex = getQuestionIndexById(8);
            if (targetIndex !== -1) {
                nextQuestionIndex = targetIndex;
            } else {
                console.error("質問ID 8が見つかりません。");
            }
        }

        const nextQuestion = questions[nextQuestionIndex];
        if (nextQuestion) {
            setMessages(prev => [...prev, { text: nextQuestion.question, sender: 'bot' }]);
            if (nextQuestion.type !== "date" && nextQuestion.type !== "text" && nextQuestion.type !== "confirm") {
                setSelectedOption('');
            }
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            setMessages(prev => [...prev, { text: "質問はすべて終了しました。", sender: 'bot' }]);
            await sendData();
        }

        if (typeof option === 'string') {
            setSelectedOptions(prev => [...prev, option]);
        } else if (option instanceof Date) {
            setSelectedOptions(prev => [...prev, option.toLocaleString()]);
            setSelectedDate(null);
        }
    };

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        addMessage(option);
    };

    const handleTextChange = (text: string) => {
        addMessage(text);
    };

    const sendData = async () => {
        const data = {
            reservationType: selectedOptions[0],
            store: selectedOptions[1],
            datetime: selectedOptions[2],
            name: selectedOptions[3],
            email: selectedOptions[4],
            phone: selectedOptions[5],
            confirmation: selectedOptions[6],
            otherInquiry: selectedOptions[7] || '',
        };

        console.log('送信データ:', data);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('メールが正常に送信されました。');
            } else {
                console.error('メール送信に失敗しました。');
            }
        } catch (error) {
            console.error('エラーが発生しました:', error);
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.sender === 'bot' && (
                            <figure>
                                <img src="/images/bot_icon.svg" alt="ボット" />
                            </figure>
                        )}
                        <p className='message_text'>{message.text}</p>
                    </div>
                ))}
                {currentQuestionIndex < questions.length && (
                    <>
                        {questions[currentQuestionIndex].type === "date" ? (
                            <div className="input_field">
                                <div className="bot_wrap">
                                    <figure>
                                        <img src="/images/bot_icon.svg" alt="ボット" />
                                    </figure>
                                    <p className='question'>{questions[currentQuestionIndex].question}</p>
                                </div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => setSelectedDate(date)}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    onSelect={() => {
                                        if (selectedDate) {
                                            addMessage(selectedDate);
                                        }
                                    }}
                                />
                            </div>
                        ) : questions[currentQuestionIndex].type === "text" || !questions[currentQuestionIndex].options ? (
                            <div className="input_field">
                                <div className="bot_wrap">
                                    <figure>
                                        <img src="/images/bot_icon.svg" alt="ボット" />
                                    </figure>
                                    <p className='question'>{questions[currentQuestionIndex].question}</p>
                                </div>
                                <input
                                    type="text"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() !== '') {
                                            const target = e.target as HTMLInputElement;
                                            handleTextChange(target.value.trim());
                                            target.value = '';
                                        }
                                    }}
                                    placeholder="入力してください"
                                />
                            </div>
                        ) : questions[currentQuestionIndex].type === "confirm" ? (
                            <div className="input_field">
                                <div className="bot_wrap">
                                    <figure>
                                        <img src="/images/bot_icon.svg" alt="ボット" />
                                    </figure>
                                    <p className='question'>{questions[currentQuestionIndex].question}</p>
                                </div>
                                <button onClick={() => addMessage("はい")}>はい</button>
                                <button onClick={() => addMessage("いいえ")}>いいえ</button>
                            </div>
                        ) : (
                            <InputField 
                                question={questions[currentQuestionIndex]}
                                selectedOption={selectedOption}
                                handleOptionChange={handleOptionChange}
                                previousQuestions={questions.slice(0, currentQuestionIndex)}
                                selectedOptions={selectedOptions}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;