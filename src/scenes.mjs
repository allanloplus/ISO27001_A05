// =============================================================
//  ISO/IEC 27001:2022 身分與存取管理（Identity & Access Management）
//  動畫簡報腳本：講師 Allan Lo（A）＋ 助教 阿拉蕾（R）
//
//  每個場景：
//    chapter : 章節名稱（播放器章節導覽）
//    stage   : 標頭流程燈號 0=無 1/2/3=流程三段 4=稽核 5=缺失 6=全部
//    facet   : 右上角面向標籤
//    hat     : Allan 是否戴上稽核員帽子
//    html    : 畫面內容（850x496 內容區）
//    lines   : [講者, 字幕文字, (選用)發音文字]
//
//  動畫屬性 A(type, 第幾句出現, 額外延遲秒, 第幾句淡出, [強調句]) 由播放器依語音時間軸換算
// =============================================================
import { ic } from './icons.mjs';

const A = (type, at, d = 0, out = null, hl = null) =>
  ` data-in="${type} ${at} ${d}"` +
  (out != null ? ` data-out="${out}"` : '') +
  (hl ? ` data-hl="${[].concat(hl).join(' ')}"` : '');

const tag = (no, cls = '') => `<span class="tag ${cls}">${no}</span>`;

// ---------- S0 開場 ----------
const s0 = {
  chapter: '開場', stage: 0, facet: '',
  html: `
  <div class="title-wrap">
    <div class="eyebrow"${A('fade', 0)}>ISO/IEC 27001:2022 控制屬性｜運作能力 Operational capabilities</div>
    <h1 class="big-title"${A('zoom', 0, 0.3)}>身分與<span class="hl-y">存取管理</span></h1>
    <div class="sub-title"${A('up', 0, 0.8)}>Identity &amp; Access Management</div>
    <div class="facets">
      <div class="facet f1"${A('pop', 4, 1.2)}>${ic('flag', '#fff', 30)}<b>ISMS 作業重點</b></div>
      <div class="facet f2"${A('pop', 4, 2.6)}>${ic('search', '#fff', 30)}<b>稽核查核重點</b></div>
      <div class="facet f3"${A('pop', 4, 3.7)}>${ic('alert', '#fff', 30)}<b>常見的缺失</b></div>
    </div>
    <div class="intro-row">
      <div class="badge-name nv"${A('left', 0, 1.2)}><small>講師</small>Allan Lo<em>ISMS／PIMS 輔導顧問・驗證公司稽核員</em></div>
      <div class="badge-name pp"${A('left', 1)}><small>助教</small>阿拉蕾<em>好奇心滿點的機器人助教</em></div>
    </div>
    <div class="sticker"${A('stamp', 5, 0.5)}>輔導 × 稽核<br>雙視角實戰</div>
  </div>`,
  lines: [
    ['A', '各位學員大家好！我是你們的資安老朋友，Allan Lo，大家叫我Allan老師就好。'],
    ['R', '嗯洽～大家好！我是今天的助教阿拉蕾！老師老師，今天要上什麼呀？'],
    ['A', '今天要聊的，是ISO 27001:2022控制屬性中，「運作能力」分類裡的身分與存取管理，英文叫Identity and Access Management。'],
    ['R', '存取管理？是不是就是…誰可以進門、誰可以開電腦？'],
    ['A', '答對一半！今天我們用三個面向來拆解：第一，ISMS作業重點；第二，稽核查核重點；第三，常見的缺失。'],
    ['A', '我平常是輔導顧問，也是驗證稽核員，所以今天會把兩邊的眼光都告訴你，保證實戰！'],
    ['R', '哇！那我要趕快拿筆記本出來了！'],
  ],
};

// ---------- S1 全景地圖 ----------
const s1 = {
  chapter: '流程全景', stage: 6, facet: '流程全景',
  html: `
  <h2 class="scene-h"${A('left', 0)}>${ic('list', '#0f766e', 34)}存取管理三段式流程</h2>
  <div class="map">
    <div class="map-col c1"${A('up', 1)}>
      <div class="chev">基於業務營運之存取要求</div>
      <div class="chip"${A('pop', 1, 3.2)}>${tag('5.15')}存取控制</div>
      <div class="chip"${A('pop', 1, 4.6)}>${tag('5.3')}職務區隔</div>
      <div class="chip"${A('pop', 1, 6.0)}>${tag('5.37')}書面紀錄之運作程序</div>
      <div class="col-note">先定規則</div>
    </div>
    <div class="map-col c2"${A('up', 2)}>
      <div class="chev">使用者存取管理</div>
      <div class="chip"${A('pop', 2, 2.6)}>${tag('5.16')}身分管理</div>
      <div class="chip"${A('pop', 2, 3.8)}>${tag('5.17')}鑑別資訊</div>
      <div class="chip"${A('pop', 2, 5.0)}>${tag('5.18')}存取權限</div>
      <div class="chip fixchip"${A('pop', 2, 6.4, null, 4)}>${tag('8.5', 't-red')}安全鑑別</div>
      <div class="col-note">再管身分</div>
    </div>
    <div class="map-col c3"${A('up', 5)}>
      <div class="chev">系統、應用、實體存取管理</div>
      <div class="chip"${A('pop', 5, 2.6)}>${tag('7.2')}實體進入</div>
      <div class="chip"${A('pop', 5, 3.8)}>${tag('8.2')}特殊存取權限</div>
      <div class="chip"${A('pop', 5, 5.0)}>${tag('8.3')}資訊存取限制</div>
      <div class="chip"${A('pop', 5, 6.2)}>${tag('8.4')}對原始碼之存取</div>
      <div class="col-note">守住每一道門</div>
    </div>
  </div>
  <div class="correction"${A('stampS', 4, 0.6)}>
    <b>編號更正</b>「安全鑑別」是 <u>8.5</u>，不是 5.17<br>
    <small>5.17 管密碼等鑑別資訊本身；8.5 管登入機制（MFA、鎖定…）</small>
  </div>
  <div class="slogan"${A('wipe', 7, 0.8)}>先定規則 ➜ 再管身分<br>➜ 守住每一道門</div>`,
  lines: [
    ['A', '先來看全景地圖。整個存取管理，就像一條生產線，分成三段。'],
    ['A', '第一段，是基於業務營運之存取要求：包含5.15存取控制、5.3職務區隔，以及5.37書面紀錄之運作程序。'],
    ['A', '第二段，是使用者存取管理：5.16身分管理、5.17鑑別資訊、5.18存取權限，再搭配8.5安全鑑別。'],
    ['R', '等等老師！我看到有的講義寫「5.17安全鑑別」耶？'],
    ['A', '好眼力！安全鑑別在2022版的正確編號是8.5，屬於技術控制。5.17管的是密碼這類鑑別資訊本身，8.5管的是登入機制，兩個是好兄弟，但要分清楚喔。'],
    ['A', '第三段，是系統、應用與實體的存取管理：7.2實體進入、8.2特殊存取權限、8.3資訊存取限制，還有8.4對原始碼之存取。'],
    ['R', '所以是：先定規則，再管人，最後管門跟系統！'],
    ['A', '漂亮！一句話記住：先定規則、再管身分、最後守住每一道門。'],
  ],
};

// ---------- S2 第一段：業務營運之存取要求 ----------
const s2 = {
  chapter: '一、業務存取要求', stage: 1, facet: 'ISMS 作業重點',
  html: `
  <div class="principle"${A('zoom', 0, 0.4, 7)}>
    <span>${ic('key', '#fff', 30)}最小權限 <i>Least privilege</i></span>
    <span class="plus">＋</span>
    <span>${ic('eye', '#fff', 30)}有需要才知道 <i>Need-to-know</i></span>
  </div>
  <div class="cards3"${A('fade', 1, 0, 7)}>
    <div class="card k1"${A('up', 1)}>
      <h3>${tag('5.15')}存取控制</h3>
      <ul class="b">
        <li${A('left', 1, 2.0)}>訂定<b>存取控制政策</b></li>
        <li${A('left', 1, 4.0)}>依業務與資安要求決定誰、存取什麼、怎麼存取</li>
        <li${A('left', 2, 0.3)}>涵蓋<b>實體</b>＋<b>邏輯</b>兩層面</li>
      </ul>
    </div>
    <div class="card k2"${A('up', 3)}>
      <h3>${tag('5.3')}職務區隔</h3>
      <ul class="b">
        <li${A('left', 3, 1.4)}>衝突職務要拆開，<b>不能球員兼裁判</b></li>
        <li${A('left', 3, 3.6)}>申請者 ≠ 核准者 ≠ 執行者</li>
        <li${A('left', 6, 0.5)}>人力不足 ➜ <b>補償控制</b></li>
      </ul>
    </div>
    <div class="card k3"${A('up', 4)}>
      <h3>${tag('5.37')}書面運作程序</h3>
      <ul class="b">
        <li${A('left', 4, 2.0)}>開通、異動、刪除寫成程序</li>
        <li${A('left', 4, 4.5)}><b>拿得到、看得懂、照著做</b></li>
        <li${A('left', 4, 6.0)}>程序 = 實際作法</li>
      </ul>
    </div>
  </div>
  <div class="note-bubble"${A('pop', 6, 1.2, 7)}>小公司補償控制：<b>完整操作日誌</b>＋<b>主管定期覆核</b></div>

  <div class="case"${A('zoom', 7, 0)}>
    <div class="case-h">${ic('building', '#fff', 26)}實際案例｜製造業 ERP 權限</div>
    <div class="case-body">
      <div class="who">
        <div class="avatar">${ic('user', '#334155', 54)}<span>會計 A 同仁</span></div>
        <div class="perm"${A('right', 7, 2.2)}>${ic('key', '#b45309', 22)}新增供應商主檔</div>
        <div class="perm"${A('right', 7, 3.4)}>${ic('key', '#b45309', 22)}執行付款</div>
      </div>
      <div class="risk"${A('pop', 8, 0.4)}>
        ${ic('alert', '#dc2626', 30)}風險：建立假廠商 ➜ 付款給自己
      </div>
      <div class="sod"${A('up', 9, 2.6)}>
        <div class="sod-h">改善：職務衝突矩陣（SoD Matrix）</div>
        <table>
          <tr><th></th><th>主檔維護</th><th>請購核准</th><th>執行付款</th></tr>
          <tr><th>主檔維護</th><td>—</td><td class="ok">○</td><td class="ng">✕</td></tr>
          <tr><th>請購核准</th><td class="ok">○</td><td>—</td><td class="ng">✕</td></tr>
          <tr><th>執行付款</th><td class="ng">✕</td><td class="ng">✕</td><td>—</td></tr>
        </table>
        <div class="sod-f">ERP 設定<b>互斥角色</b>，系統直接擋</div>
      </div>
    </div>
  </div>
  <div class="take"${A('wipe', 10, 0.4)}>第一段三把鑰匙：<b>政策先行・衝突拆分・程序落地</b></div>`,
  lines: [
    ['A', '我們進入第一段：業務營運的存取要求。核心精神只有一句話：「最小權限」加上「有需要才知道」。'],
    ['A', '5.15存取控制，組織要訂出存取控制政策，依照業務與資安要求，決定誰能存取什麼資訊、用什麼方式存取。'],
    ['R', '而且要涵蓋實體與邏輯兩個層面！邏輯就是系統帳號，實體就是門禁卡，對吧？'],
    ['A', '沒錯！5.3職務區隔，就是把有衝突的職務拆開，不能球員兼裁判。例如申請權限的人，不能自己核准自己。'],
    ['A', '5.37書面紀錄之運作程序，就是把帳號開通、異動、刪除這些作業寫成程序，而且要讓需要的人拿得到、看得懂、照著做。'],
    ['R', '那小公司只有三個人怎麼辦？大家都是球員，也都是裁判啊！'],
    ['A', '問得好！人力不足的時候，可以用補償控制：例如保留完整的操作日誌，由主管或老闆定期覆核，這也是稽核員可以接受的做法。'],
    ['A', '來看個實際案例。我輔導過一家製造業，會計同仁同時有ERP「新增供應商主檔」和「執行付款」兩個權限。'],
    ['R', '那…他不就可以自己開一家假廠商，然後付錢給自己？'],
    ['A', '賓果！雖然那位同仁很誠實，但制度不能靠人品。後來我們做了一張職務衝突矩陣，把衝突權限拆給兩個人，系統也設定成互斥角色。'],
    ['A', '重點整理：政策先行、衝突拆分、程序落地。第一段的三把鑰匙，請收好！'],
  ],
};

// ---------- S3 第二段：使用者存取管理 ----------
const s3 = {
  chapter: '二、使用者存取管理', stage: 2, facet: 'ISMS 作業重點',
  html: `
  <div class="jml"${A('fade', 0, 0, 9)}>
    <svg viewBox="0 0 300 300" class="jml-ring" aria-hidden="true">
      <circle cx="150" cy="150" r="104" fill="none" stroke="#bfdbfe" stroke-width="14"/>
      <circle cx="150" cy="150" r="104" fill="none" stroke="#3b82f6" stroke-width="14" stroke-linecap="round" pathLength="1" class="ring-draw"${A('draw', 0, 1.0)}/>
    </svg>
    <div class="jml-c">帳號<br>生命週期</div>
    <div class="jml-n n1"${A('pop', 0, 3.5)}>${ic('user', '#fff', 26)}<b>到職</b><i>Joiner</i></div>
    <div class="jml-n n2"${A('pop', 0, 4.4)}>${ic('refresh', '#fff', 26)}<b>異動</b><i>Mover</i></div>
    <div class="jml-n n3"${A('pop', 0, 5.4)}>${ic('door', '#fff', 26)}<b>離職</b><i>Leaver</i></div>
  </div>
  <div class="grid4"${A('fade', 1, 0, 9)}>
    <div class="card mini"${A('up', 1)}>
      <h3>${tag('5.16')}身分管理</h3>
      <ul class="b sm"><li><b>一人一號</b>，責任追得到</li><li>共用帳號原則禁止；必要時核准＋使用紀錄</li></ul>
    </div>
    <div class="card mini"${A('up', 3, 1.6)}>
      <h3>${tag('5.17')}鑑別資訊</h3>
      <ul class="b sm"><li>初始密碼安全交付、首次登入強制變更</li><li>不貼便利貼、不用 Email 明文傳</li></ul>
    </div>
    <div class="card mini"${A('up', 5, 1.2)}>
      <h3>${tag('8.5', 't-red')}安全鑑別</h3>
      <ul class="b sm"><li>重要系統 <b>MFA</b></li><li>登入失敗鎖定、不提示錯誤線索</li></ul>
    </div>
    <div class="card mini"${A('up', 6)}>
      <h3>${tag('5.18')}存取權限</h3>
      <ul class="b sm"><li>資訊擁有者核准才開通</li><li>異動<b>先收回</b>再給；離職即停用</li><li>定期審查：一般半年、特權每季</li></ul>
    </div>
  </div>
  <div class="postit"${A('pop', 4, 0.3, 5)}>我的密碼<br><b>aralei1234</b><span class="stampx"${A('stamp', 5, 0.2)}>危險！</span></div>
  <div class="creep"${A('pop', 8, 1.0, 9)}>
    <div class="creep-h">權限蠕變 Privilege creep</div>
    <div class="bars">
      <div class="bar"><i style="height:30%"></i><span>第1年</span></div>
      <div class="bar"><i style="height:62%"></i><span>第5年</span></div>
      <div class="bar"><i class="hot" style="height:100%"></i><span>第10年</span></div>
    </div>
    <div class="creep-f">比總經理還大！</div>
  </div>

  <div class="case"${A('zoom', 9)}>
    <div class="case-h">${ic('building', '#fff', 26)}實際案例｜離職三個月，VPN 還能登入</div>
    <div class="tl">
      <div class="tl-i"${A('left', 9, 1.6)}><b>D-Day</b>業務經理離職</div>
      <div class="tl-a">➜</div>
      <div class="tl-i warn"${A('left', 9, 3.4)}><b>+90 天</b>VPN 帳號仍可登入</div>
      <div class="tl-a">➜</div>
      <div class="tl-i bad"${A('left', 9, 5.0)}><b>事件</b>客戶名單被下載</div>
    </div>
    <div class="fixbox"${A('up', 11)}>
      <div class="fix-h">${ic('check', '#15803d', 24)}改善做法（雙重保險）</div>
      <div class="fix-row">
        <div class="fix-i"${A('pop', 11, 0.8)}>${ic('doc', '#15803d', 26)}<div>人資離職單 ➜ 自動停用 AD 帳號<br><small>離職當天 17:00 自動執行</small></div></div>
        <div class="fix-i"${A('pop', 11, 5.4)}>${ic('search', '#15803d', 26)}<div>每月 HR 名單 × 帳號清單比對<br><small>VPN、雲端信箱、SaaS 全部納入</small></div></div>
      </div>
    </div>
  </div>
  <div class="take"${A('wipe', 12, 0.4)}>第二段口訣：<b>一人一號・密碼保密・MFA 加持・權限定期審</b></div>`,
  lines: [
    ['A', '第二段是使用者存取管理。我最喜歡用「帳號生命週期」來說明：到職、異動、離職，英文叫Joiner、Mover、Leaver。'],
    ['A', '5.16身分管理：每個人要有唯一識別的帳號，一人一號，責任才追得到。共用帳號原則上禁止，真的必要，要經過核准，並記錄誰在什麼時候用。'],
    ['R', '所以admin帳號大家一起用，是不行的囉？'],
    ['A', '那可是稽核員最愛的獵物！接著是5.17鑑別資訊：初始密碼要安全交付、首次登入要強制變更，密碼不能貼在便利貼，也不能用Email明文傳送。'],
    ['R', '我的密碼是aralei1234，好記又可愛！', '我的密碼是，阿拉蕾，一二三四，好記又可愛！'],
    ['A', '拜託，這種密碼駭客三秒就破了！再搭配8.5安全鑑別：重要系統要用多因子認證MFA，登入失敗要鎖定，登入畫面也不要提示「帳號正確、密碼錯誤」這種線索。'],
    ['A', '5.18存取權限：權限要經過資訊擁有者核准才開通；人員異動時，先收回舊權限，再給新權限；離職要及時停用。還要定期審查，一般使用者每半年，特權帳號建議每季。'],
    ['R', '為什麼異動要先收回舊的呀？'],
    ['A', '因為不收回，就會出現權限累積。一個人在公司待十年，權限比總經理還大，這就叫「權限蠕變」。'],
    ['A', '實際案例來了！某公司業務經理離職三個月，結果發現他的VPN帳號還能登入，而且還下載了客戶名單。'],
    ['R', '天啊！那怎麼補救？'],
    ['A', '我們把人資系統的離職單，跟AD帳號停用串成自動化流程，離職當天下午五點自動停用；另外每個月再拿人資名單跟各系統帳號清單比對一次，雙重保險。'],
    ['A', '第二段口訣：一人一號、密碼保密、MFA加持、權限定期審！'],
  ],
};

// ---------- S4 第三段：系統、應用、實體存取管理 ----------
const s4 = {
  chapter: '三、系統應用實體', stage: 3, facet: 'ISMS 作業重點',
  html: `
  <div class="hubmap"${A('fade', 0, 0, 7)}>
    <svg class="spokes" viewBox="0 0 850 430" aria-hidden="true">
      <path d="M425 215 L250 95" pathLength="1"${A('draw', 1, 0)}/>
      <path d="M425 215 L600 95" pathLength="1"${A('draw', 2, 0)}/>
      <path d="M425 215 L250 335" pathLength="1"${A('draw', 5, 0)}/>
      <path d="M425 215 L600 335" pathLength="1"${A('draw', 6, 0)}/>
    </svg>
    <div class="hub"${A('zoom', 0, 0.6)}>${ic('crown', '#f59e0b', 46)}<b>特權</b><span class="hero"${A('stamp', 3, 0.4)}>變身！</span></div>
    <div class="spot s-tl"${A('pop', 1)}>
      <h3>${tag('7.2')}實體進入｜安全區域</h3>
      <ul class="b sm"><li>機房、檔案室：門禁＋進出紀錄</li><li>訪客登記、識別證、<b>全程陪同</b>、離開歸還</li></ul>
    </div>
    <div class="spot s-tr"${A('pop', 2)}>
      <h3>${tag('8.2')}特殊存取權限</h3>
      <ul class="b sm"><li>個別核准、<b>限制人數</b></li><li>日常用一般帳號，需要才切換管理員</li><li${A('left', 4, 3.0)}>導入 <b>PAM</b>：借用、錄影、自動換密碼</li></ul>
    </div>
    <div class="spot s-bl"${A('pop', 5)}>
      <h3>${tag('8.3')}資訊存取限制</h3>
      <ul class="b sm"><li>應用系統依<b>角色</b>控制資料與功能</li><li>例：客服只看<b>遮罩</b>後身分證字號<br><code>A12****789</code></li></ul>
    </div>
    <div class="spot s-br"${A('pop', 6)}>
      <h3>${tag('8.4')}對原始碼之存取</h3>
      <ul class="b sm"><li>原始碼、開發工具、函式庫控管讀寫</li><li>不直接改正式環境；<b>版控＋審查</b>才上線</li></ul>
    </div>
  </div>

  <div class="case"${A('zoom', 7)}>
    <div class="case-h">${ic('building', '#fff', 26)}實際案例｜委外工程師帶走「萬能鑰匙」</div>
    <div class="facts">
      <div class="fact"${A('left', 7, 2.2)}>${ic('db', '#b91c1c', 28)}<div>資料庫<b>最高權限</b>帳號</div></div>
      <div class="fact"${A('left', 7, 4.0)}>${ic('clock', '#b91c1c', 28)}<div>密碼<b>半年沒換</b></div></div>
      <div class="fact"${A('left', 7, 5.6)}>${ic('door', '#b91c1c', 28)}<div>合約結束<b>沒人收回</b></div></div>
    </div>
    <div class="fixbox"${A('up', 9)}>
      <div class="fix-h">${ic('check', '#15803d', 24)}改善：PAM 時段性授權</div>
      <div class="flow">
        <span${A('pop', 9, 1.6)}>${ic('user', '#15803d', 22)}具名帳號</span><em>➜</em>
        <span${A('pop', 9, 3.2)}>${ic('doc', '#15803d', 22)}申請＋核准</span><em>➜</em>
        <span${A('pop', 9, 4.6)}>${ic('clock', '#15803d', 22)}時段授權</span><em>➜</em>
        <span${A('pop', 9, 6.0)}>${ic('video', '#15803d', 22)}全程錄影</span><em>➜</em>
        <span${A('pop', 9, 7.2)}>${ic('refresh', '#15803d', 22)}自動收回</span>
      </div>
    </div>
  </div>
  <div class="take"${A('wipe', 10, 0.4)}>第三段口訣：<b>門禁有紀錄・特權要節制・資料看角色・原始碼要版控</b></div>`,
  lines: [
    ['A', '第三段，我們要守住每一道門：實體的門、系統的門、資料的門，還有原始碼的門。'],
    ['A', '7.2實體進入：機房、檔案室這些安全區域，要有門禁管制和進出紀錄；訪客要登記、配戴識別證、全程陪同，離開時要歸還。'],
    ['A', '8.2特殊存取權限，也就是特權帳號，像網域管理員、資料庫管理員。要個別核准、限制人數，日常作業用一般帳號，需要時才切換管理員帳號。'],
    ['R', '就像超級英雄！平常是普通人，有任務才變身！'],
    ['A', '這比喻太好了！特權帳號的使用還要留下紀錄，最好導入特權帳號管理系統PAM，做到借用、錄影、用完自動換密碼。', '這比喻太好了！特權帳號的使用還要留下紀錄，最好導入特權帳號管理系統P A M，做到借用、錄影、用完自動換密碼。'],
    ['A', '8.3資訊存取限制：在應用系統裡面，依照角色控制能看哪些資料、能用哪些功能。例如客服只能看到遮罩後的身分證字號。'],
    ['A', '8.4對原始碼之存取：原始碼、開發工具、軟體函式庫，都要控管讀寫權限；開發人員不應該直接改正式環境，程式要經過版控和審查才上線。'],
    ['A', '案例分享：某電商委外廠商的工程師，拿到資料庫的最高權限帳號，密碼半年沒換，合約結束後也沒人收回。'],
    ['R', '哇！那外包廠商根本是拿著萬能鑰匙走掉了！'],
    ['A', '後來的改善做法是：外包人員一律使用個人具名帳號，透過PAM申請時段性權限，全程錄影，用完自動收回。', '後來的改善做法是：外包人員一律使用個人具名帳號，透過P A M申請時段性權限，全程錄影，用完自動收回。'],
    ['A', '第三段口訣：門禁有紀錄、特權要節制、資料看角色、原始碼要版控。'],
  ],
};

// ---------- S5 稽核查核重點 ----------
const s5 = {
  chapter: '稽核查核重點', stage: 4, facet: '稽核查核重點', hat: true,
  html: `
  <h2 class="scene-h amber"${A('left', 1)}>${ic('search', '#b45309', 34)}稽核員三招：看文件・比清單・抽紀錄</h2>
  <div class="audit3">
    <div class="card au"${A('up', 2)}>
      <div class="au-no">1</div>
      <h3>${ic('doc', '#b45309', 26)}看文件</h3>
      <ul class="b sm">
        <li>存取控制政策、帳號管理程序</li>
        <li${A('left', 2, 3.2)}>涵蓋<b>雲端、遠端、委外</b>？</li>
        <li${A('left', 2, 5.8)}>核准＋定期審查？</li>
      </ul>
    </div>
    <div class="card au"${A('up', 3)}>
      <div class="au-no">2</div>
      <h3>${ic('list', '#b45309', 26)}比清單</h3>
      <div class="cmp">
        <div class="cmp-l"><b>HR 離職名單</b><span>王○明</span><span>李○華</span><span class="g">陳○宏</span></div>
        <div class="cmp-x">×</div>
        <div class="cmp-l"><b>AD／VPN 帳號</b><span class="del">wang.m</span><span class="del">lee.h</span><span class="g">chen.h</span></div>
      </div>
      <div class="ghost"${A('zoom', 4, 0.2)}>${ic('ghost', '#7c3aed', 40)}幽靈帳號！</div>
      <div class="ask"${A('pop', 5, 0.6)}>特權帳號逐一問：<b>誰的？誰核准？為何需要？</b></div>
    </div>
    <div class="card au"${A('up', 6)}>
      <div class="au-no">3</div>
      <h3>${ic('card', '#b45309', 26)}抽紀錄</h3>
      <ul class="b sm">
        <li>權限申請單：<b>資訊擁有者</b>核准？</li>
        <li${A('left', 6, 4.2)}>權限審查：有<b>實際刪改</b>？</li>
      </ul>
      <div class="seal"${A('stamp', 6, 6.8)}>只蓋章？</div>
    </div>
  </div>
  <div class="onsite"${A('up', 7)}>
    <b>現場觀察</b>
    <span${A('pop', 7, 1.4)}>${ic('door', '#334155', 22)}機房進出紀錄 vs 授權名單</span>
    <span${A('pop', 7, 3.6)}>${ic('lock', '#334155', 22)}密碼原則設定截圖</span>
    <span${A('pop', 7, 5.0)}>${ic('phone', '#334155', 22)}MFA 真的啟用？</span>
    <span${A('pop', 7, 6.4)}>${ic('git', '#334155', 22)}版控分支保護</span>
  </div>
  <div class="four"${A('wipe', 9, 1.0)}>
    查核四有：<b>有規定</b><em>➜</em><b>有執行</b><em>➜</em><b>有紀錄</b><em>➜</em><b>有改善</b>
  </div>`,
  lines: [
    ['R', '老師，換你戴上稽核員的帽子了！稽核員到底會查什麼？'],
    ['A', '好，帽子戴上！稽核員查存取管理，我常用三招：看文件、比清單、抽紀錄。'],
    ['A', '第一招，看文件：存取控制政策、帳號管理程序是否存在？有沒有涵蓋雲端服務、遠端存取和委外人員？是否經過核准並定期審查？'],
    ['A', '第二招，比清單：我會跟人資要最近半年的離職名單，再跟AD、ERP、VPN的帳號清單交叉比對，看看有沒有幽靈帳號。'],
    ['R', '幽靈帳號！聽起來好可怕喔！'],
    ['A', '還會拿特權帳號清單，一個一個問：這個帳號是誰的？誰核准的？為什麼需要？'],
    ['A', '第三招，抽紀錄：抽樣權限申請單，看是不是由資訊擁有者核准；再抽權限審查紀錄，看審查有沒有實際刪改，而不是只蓋個章。'],
    ['A', '另外還會現場觀察：機房的進出紀錄跟授權名單是否一致？密碼原則的系統設定截圖、MFA有沒有真的啟用？版控系統的分支保護有沒有開？'],
    ['R', '原來稽核員像偵探一樣，真相都藏在證據裡！'],
    ['A', '哈哈，沒錯！稽核講的是證據。查核口訣是四有：有規定、有執行、有紀錄、有改善。'],
  ],
};

// ---------- S6 常見的缺失 ----------
const F = [
  ['離職帳號未即時停用', '5.18', 'VPN、雲端信箱、SaaS 被漏掉', 2],
  ['權限審查流於形式', '5.18', '只寫「無異常」，無清單、無調整', 3],
  ['共用／預設帳號未管理', '5.16', 'administrator 大家一起用', 5],
  ['自己申請、自己核准', '5.3', '管理者球員兼裁判', 6],
  ['密碼原則與設定不一致', '5.17・5.37', '程序寫 12 碼，GPO 只設 6 碼', 7],
  ['特權與服務帳號失控', '8.2・8.4', '開發有正式環境管理權、密碼寫死在程式', 8],
  ['機房訪客未陪同', '7.2', '紀錄不全、門禁卡未繳回', 9],
  ['政策未涵蓋雲端與遠端', '5.15', '還停留在只有內網的年代', 10],
];
const s6 = {
  chapter: '常見的缺失', stage: 5, facet: '常見的缺失',
  html: `
  <h2 class="scene-h red"${A('left', 1)}>${ic('alert', '#b91c1c', 34)}驗證稽核現場｜八大常見缺失</h2>
  <div class="nc-grid"${A('fade', 1, 0, 13)}>
    ${F.map(([t, c, d, at], i) => `
    <div class="nc"${A('pop', at, 0, null, i < 2 ? 12 : null)}>
      <div class="nc-no">${i + 1}</div>
      <div class="nc-t">${t}</div>
      <div class="nc-c">${tag(c, 't-red')}</div>
      <div class="nc-d">${d}</div>
      ${i < 2 ? `<div class="rank"${A('stamp', 12, i === 0 ? 1.4 : 3.4)}>No.${i + 1}</div>` : ''}
    </div>`).join('')}
  </div>
  <div class="homework"${A('pop', 4, 0.2, 5)}>寒假作業：<br>「已完成」✔<br><small>（內容呢？）</small></div>

  <div class="quiz"${A('zoom', 13)}>
    <div class="quiz-h">快問快答</div>
    <div class="quiz-q">主管每季做權限審查，<b>有簽名、有日期</b>，但<b>沒附帳號清單</b>……算缺失嗎？</div>
    <div class="quiz-a"${A('stamp', 14, 0.1)}>算！</div>
    <div class="quiz-why"${A('up', 14, 2.0)}>
      ${ic('check', '#15803d', 26)}<div>正確做法：附上當時<b>系統匯出</b>的帳號權限清單，逐筆標註<b>保留／刪除／調整</b>，並追蹤到結案。</div>
    </div>
  </div>`,
  lines: [
    ['R', '最後是大家最怕的單元：常見缺失！老師快告訴我們，哪些坑不要踩！'],
    ['A', '好，我整理了驗證稽核現場最常開立的八大缺失，大家一起來看！'],
    ['A', '第一個：離職人員帳號未即時停用。這是5.18最經典的缺失，常常是VPN、雲端信箱或SaaS系統被漏掉。', '第一個：離職人員帳號未即時停用。這是5.18最經典的缺失，常常是VPN、雲端信箱或薩斯雲端系統被漏掉。'],
    ['A', '第二個：權限審查流於形式。審查表上只有一句「經檢視無異常」，但拿不出當時的帳號清單，也沒有任何調整紀錄。'],
    ['R', '就像寒假作業只寫「已完成」，但裡面沒有內容！'],
    ['A', '第三個：共用帳號或預設帳號沒有管理，例如大家共用administrator，出事了找不到是誰做的，這違反5.16。'],
    ['A', '第四個：系統管理者自己申請、自己核准、自己審查，這就是5.3職務區隔的缺失。'],
    ['A', '第五個：密碼原則與實際設定不一致。程序寫密碼要十二碼，系統GPO設定卻只有六碼，這同時是5.17與5.37的問題。'],
    ['A', '第六個：特權帳號未限制。開發人員都有正式環境的管理員權限，或是服務帳號的密碼寫死在程式碼裡，這是8.2和8.4的問題。'],
    ['A', '第七個：機房訪客沒有陪同、進出紀錄不完整，或是離職人員的門禁卡沒有繳回，違反7.2。'],
    ['A', '第八個：存取控制政策沒有涵蓋雲端服務和遠端存取，政策還停留在十年前只有內網的時代。'],
    ['R', '老師，那哪一個最常見呀？'],
    ['A', '依我的經驗，第一名是離職帳號，第二名是權限審查流於形式。這兩個，稽核員幾乎每次都會抽！'],
    ['R', '快問快答時間！老師，如果主管每季做權限審查，有簽名、有日期，但沒有附帳號清單，這樣算缺失嗎？'],
    ['A', '算！因為無法證明審查了什麼。正確做法是附上當時系統匯出的帳號權限清單，逐筆標註保留、刪除或調整，並且追蹤到結案。'],
  ],
};

// ---------- S7 總結 ----------
const s7 = {
  chapter: '總結', stage: 6, facet: '總結', hat: false,
  html: `
  <h2 class="scene-h"${A('left', 0)}>${ic('shield', '#0f766e', 34)}今日重點總整理</h2>
  <div class="sum3">
    <div class="card sm1"${A('up', 1)}>
      <h3>${ic('flag', '#0f766e', 26)}ISMS 作業重點</h3>
      <ul class="b sm"><li>政策先行・職務區隔・程序落地</li><li>一人一號・MFA・定期審查</li><li>特權節制・門禁管理・原始碼版控</li></ul>
    </div>
    <div class="card sm2"${A('up', 2)}>
      <h3>${ic('search', '#b45309', 26)}稽核查核重點</h3>
      <ul class="b sm"><li>看文件・比清單・抽紀錄</li><li>有規定・有執行・有紀錄・有改善</li></ul>
    </div>
    <div class="card sm3"${A('up', 3)}>
      <h3>${ic('alert', '#b91c1c', 26)}常見缺失四大地雷</h3>
      <ul class="b sm"><li>離職帳號未停用</li><li>權限審查流於形式</li><li>共用帳號</li><li>自己核准自己</li></ul>
    </div>
  </div>
  <div class="motto"${A('zoom', 5, 2.4)}>
    讓<b>對的人</b>，在<b>對的時間</b>，用<b>對的權限</b>，做<b>對的事</b>
  </div>
  <div class="bye"${A('stamp', 6, 0.4)}>下堂課見！</div>`,
  lines: [
    ['A', '最後，我們來總結今天的身分與存取管理。'],
    ['A', '作業重點：政策先行、職務區隔、程序落地；一人一號、MFA、定期審查；特權節制、門禁管理、原始碼版控。'],
    ['A', '稽核重點：看文件、比清單、抽紀錄，還有記得四有：有規定、有執行、有紀錄、有改善。'],
    ['A', '常見缺失：離職帳號、形式審查、共用帳號、自己核准自己，這四大地雷，大家回去先自我檢查！'],
    ['R', '我學會了！回去就把我的aralei1234改掉，還要加上MFA！', '我學會了！回去就把我的阿拉蕾一二三四改掉，還要加上MFA！'],
    ['A', '很好！存取管理不是為了刁難使用者，而是讓對的人，在對的時間，用對的權限，做對的事。'],
    ['R', '嗯洽！謝謝大家，我們下次見！'],
    ['A', '我是Allan老師，我們下堂課再見，拜拜！'],
  ],
};

export const scenes = [s0, s1, s2, s3, s4, s5, s6, s7];
