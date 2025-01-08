import '../../styles/css/result.css';

const Result = () => {
    return (
        <div className="result_wrap">
            <div className="bot_wrap">
                <figure>
                    <img src="/images/bot_icon.svg" alt="ボット" />
                </figure>
                <div className="bot_content">
                    <p className='question'>あなたにおすすめの転職サイトはこちら！</p>
                    <picture className="result_bnr">
                        <img src="/images/result_bnr.png" alt="転職サイト" />
                    </picture>
                </div>
            </div>
        </div>
    );
};

export default Result;