import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 環境変数から設定を取得
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

// Nodemailerのトランスポーターを設定
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // 465番ポートはsecure
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

// メール送信関数
const sendEmails = async (data: any) => {
    const {
        reservationType,
        store,
        datetime,
        name,
        email,
        phone,
        confirmation,
    } = data;

    // 管理者への問い合わせメール
    const mailOptionsAdmin = {
        from: FROM_EMAIL,
        to: FROM_EMAIL, // 管理者のメールアドレス
        subject: '新しいお問い合わせがありました',
        text: `
            新しいお問い合わせがありました。

            ご予約・お問い合わせの種類: ${reservationType}
            ご希望の店舗: ${store}
            ご希望の日時: ${datetime}
            氏名: ${name}
            メールアドレス: ${email}
            お電話番号: ${phone}
            確認: ${confirmation}
        `,
    };

    // ユーザーへのサンクスメール
    const mailOptionsUser = {
        from: FROM_EMAIL,
        to: email,
        subject: 'お問い合わせありがとうございます',
        text: `
            ${name} 様、

            この度はお問い合わせいただきありがとうございます。
            内容を確認後、担当者よりご連絡いたします。

            ---
            ご予約・お問い合わせの種類: ${reservationType}
            ご希望の店舗: ${store}
            ご希望の日時: ${datetime}
            お電話番号: ${phone}
            確認: ${confirmation}
            ---
            
            よろしくお願いいたします。
        `,
    };

    // 管理者へメールを送信
    await transporter.sendMail(mailOptionsAdmin);

    // ユーザーへサンクスメールを送信
    await transporter.sendMail(mailOptionsUser);
};

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // バリデーション（必要に応じて追加）
        if (
            !data.reservationType ||
            !data.store ||
            !data.datetime ||
            !data.name ||
            !data.email ||
            !data.phone ||
            !data.confirmation
        ) {
            return NextResponse.json({ message: 'すべてのフィールドを入力してください。' }, { status: 400 });
        }

        await sendEmails(data);

        return NextResponse.json({ message: 'メールが送信されました。' }, { status: 200 });
    } catch (error) {
        console.error('メール送信エラー:', error);
        return NextResponse.json({ message: 'メールの送信に失敗しました。' }, { status: 500 });
    }
}