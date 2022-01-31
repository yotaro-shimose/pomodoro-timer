# DjangoによるPomodoroTimer
- Googleアカウントと連携し、Timerに管理された作業情報をGoogleカレンダーに登録
- 登録できる作業はGoogleタスクに登録されている情報
- バックエンドのみ。フロントエンドは[別開発]("https://github.com/waderaku/NativePomodoroTimer_Front")
- 別途GCPによるGoogle oauth認証を許可するトークンの発行が必要
- 動作させるには、フロント、バックエンドの両サーバーを立ち上げた上で、pomodoro_timer/constants.pyを作成し、各定数を記述する必要がある。以下例
```python
CLIENT_ID = "DjangoがアクセスするためのクライアントID。expoと同様のもので問題ない"
CLIENT_SECRET = "Djangoがアクセスするためのクライアントシークレット。"
REDIRECT_URI = "postmessage"
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/tasks",
]

```

