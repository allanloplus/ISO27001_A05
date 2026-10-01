# ISO 27001:2022 身分與存取管理｜動畫教學影片

Q 版 **Allan Lo 講師**（台灣男聲）＋ **阿拉蕾助教** 對話式動畫簡報，依「運作能力：Identity & Access Management」流程，從三個面向講解：

1. **ISMS 作業重點**：三段式流程
   - 基於業務營運之存取要求：5.15 存取控制、5.3 職務區隔、5.37 書面紀錄之運作程序
   - 使用者存取管理：5.16 身分管理、5.17 鑑別資訊、5.18 存取權限、8.5 安全鑑別
   - 系統、應用、實體存取管理：7.2 實體進入、8.2 特殊存取權限、8.3 資訊存取限制、8.4 對原始碼之存取
2. **稽核查核重點**：看文件・比清單・抽紀錄、現場觀察、查核四有
3. **常見的缺失**：八大常見缺失＋快問快答

每段附實際管理案例（ERP 職務衝突、離職 VPN 帳號、委外工程師特權帳號）。

> 註：原講義圖中「5.17 安全鑑別」在 2022 版正確編號為 **8.5 安全鑑別**，影片中已更正並說明。

## 成品

| 檔案 | 說明 |
|---|---|
| `dist/ISO27001_身分與存取管理.mp4` | 1920×1080 影片（約 11 分 46 秒） |
| `dist/index.html` + `dist/narration.mp3` | 互動播放器（章節跳轉、變速、全螢幕），兩檔放同一資料夾以瀏覽器開啟 |
| `dist/subtitles.srt` | 字幕檔 |
| `docs/講稿.md` | 含時間碼的完整講稿 |

## 修改與重建

- 講稿與畫面：`src/scenes.mjs`（每句 `[講者, 字幕, 選用發音]`，`A(...)` 設定元素在第幾句出現）
- 樣式與角色：`src/template.html`
- 語音參數：`build/tts.py`（Allan＝`zh-TW-YunJheNeural`、阿拉蕾＝`zh-TW-HsiaoYuNeural` 調高音調）

```bash
pip install edge-tts
node build/build.mjs              # 產生語音、時間軸、播放器、講稿、字幕
node build/build.mjs --no-tts     # 只改畫面時，沿用既有語音
node build/render.mjs             # 逐格錄製 MP4（需 Playwright Chromium + ffmpeg）
node build/render.mjs --stills 30,120   # 輸出指定秒數截圖檢查版面
```

語音由 Microsoft Edge 線上 Neural TTS 產生；阿拉蕾為原創 Q 版致敬造型，若影片要公開或商業發行，請留意角色名稱與造型的著作權／商標授權。
