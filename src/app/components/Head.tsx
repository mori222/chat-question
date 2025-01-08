import '../../styles/css/head.css';

const Head = () => {
    return (
        <div className="head_wrap">
            <div className="left_wrap">
                <figure>
                    <img src="/images/arrow.svg" alt="矢印" />
                </figure>
                <p className="name">転職お助けさん</p>
            </div>
            <div className="right_wrap">
                <figure><img src="/images/search.svg" alt="検索" /></figure>
                <figure><img src="/images/phone.svg" alt="電話" /></figure>
                <figure><img src="/images/hamburger.svg" alt="ハンバーガー" /></figure>
            </div>
        </div>
    );
};

export default Head;