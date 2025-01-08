const InputField = ({ 
    question, 
    selectedOption, 
    handleOptionChange, 
    previousQuestions, 
    selectedOptions 
}: { 
    question: { 
        id: number,
        question: string, 
        options?: string[],
        type?: string 
    }, 
    selectedOption: string, 
    handleOptionChange: (option: string) => void, 
    previousQuestions: {
        id: number,
        question: string,
        options?: string[],
        type?: string
    }[], 
    selectedOptions: string[] 
}) => {
    const options = question?.options || [];
    
    return (
        <div className="input_field">
            {/* 過去の質問をすべて表示 */}
            {previousQuestions.map((prevQuestion, index) => (
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
            {/* 現在の質問を表示 */}
            <div className="bot_wrap">
                <figure>
                    <img src="/images/bot_icon.svg" alt="ボット" />
                </figure>
                <p className='question'>{question?.question}</p>
            </div>
            <div className="option_wrap">
                {options.map((option) => (
                    <div key={option} className='button'>
                        <input
                            type="radio"
                            id={option}
                            name="question"
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => handleOptionChange(option)}
                        />
                        <label htmlFor={option}>{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputField;