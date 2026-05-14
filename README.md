# 株式会社Zelix 公式コーポレートサイト

Cloudflare Pagesで公開する想定の静的コーポレートサイトです。

## ページ構成

- `index.html` - TOP / お問い合わせフォーム
- `services.html` - SERVICE
- `company.html` - COMPANY / MVV
- `careers.html` - RECRUIT

## Cloudflare Pages設定

- Framework preset: `None`
- Build command: 空欄
- Build output directory: `/`
- GitHub連携後、`main` ブランチへpushすると自動デプロイできます。

## お問い合わせフォーム設定

フォームはFormspreeを優先して実装しています。

1. Formspreeでフォームを作成します。
2. 送信先メールアドレスを `uzawa@zelix-jp.com` に設定します。
3. 発行されたエンドポイントを `index.html` の以下に反映します。

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" data-contact-form>
```

`YOUR_FORM_ID` を実際のFormspree IDに置き換えてください。

Formspree未設定の状態でも、画面上では送信完了メッセージの表示確認ができます。実運用前に必ずFormspreeのエンドポイントを設定してください。

## 画像

- `assets/zelix-logo.jpg` - ヘッダー、favicon、フッター用ロゴ
- `assets/zelix-logo-glow.png` - TOPファーストビュー用軽量ロゴ
- `assets/zelix-logo-glow-original.png` - 元画像保管用
