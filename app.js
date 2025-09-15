const app = document.getElementById("app");
const topBar = document.getElementById("top-bar");
let userAccount = null;

// 模拟永久保存邀请人地址（真实场景应存到后端或智能合约）
let inviterBinding = {}; // { "用户钱包地址": "邀请人钱包地址" }

// 更新顶部钱包状态
function updateTopBar() {
  topBar.textContent = userAccount ? "钱包状态: " + userAccount : "钱包状态: 未连接";
}

// 登录页面
function renderLogin() {
  updateTopBar();
  app.innerHTML = `
    <div class="page">
      <h1>欢迎登录</h1>
      <button id="connectWallet">连接钱包</button>
      <p id="status"></p>
    </div>
  `;

  document.getElementById("connectWallet").addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];
        updateTopBar();

        // 检查钱包是否已绑定邀请人
        if (!inviterBinding[userAccount]) {
          document.getElementById("status").textContent = "钱包已连接，请绑定邀请人关系（注册）";
          setTimeout(() => renderConfirm(), 1000);
        } else {
          document.getElementById("status").textContent = "钱包已连接，邀请人已绑定";
          setTimeout(() => renderHome(), 1000);
        }
      } catch (err) {
        document.getElementById("status").textContent = "连接失败: " + err.message;
      }
    } else {
      document.getElementById("status").textContent = "未检测到钱包，请安装 MetaMask";
    }
  });
}

// 注册/确认关系页面
function renderConfirm() {
  updateTopBar();
  app.innerHTML = `
    <div class="page">
      <h2>绑定邀请人关系（注册）</h2>
      <p>请输入邀请人钱包地址完成绑定：</p>
      <input type="text" id="inviterInput" placeholder="邀请人钱包地址" style="width:80%;padding:8px;margin-bottom:15px;">
      <button id="confirmBtn">确认绑定</button>
    </div>
  `;

  document.getElementById("confirmBtn").addEventListener("click", () => {
    const inviterAddr = document.getElementById("inviterInput").value.trim();
    if (inviterAddr) {
      inviterBinding[userAccount] = inviterAddr;
      alert("绑定成功！");
      renderHome();
    } else {
      alert("请输入邀请人钱包地址！");
    }
  });
}

// 首页及其他页面
function renderHome() { renderPage("首页", "欢迎来到应用！"); }
function renderGroup() { renderPage("拼团页面", "这里是拼团功能。"); }
function renderEarn() { renderPage("赚币页面", "这里是赚币功能。"); }
function renderExchange() { renderPage("兑换页面", "这里是兑换功能。"); }

function renderMine() {
  updateTopBar();
  app.innerHTML = `
    <div class="page">
      <h1>我的页面</h1>
      <p>这里是用户个人中心。</p>
      <div class="wallet-address">
        <strong>钱包地址:</strong><br>${userAccount ? userAccount : "未连接"}
      </div>
      <div class="wallet-address">
        <strong>邀请人钱包:</strong><br>${inviterBinding[userAccount] ? inviterBinding[userAccount] : "未绑定"}
      </div>
    </div>

    <div class="bottom-nav">
      <a href="#" id="nav-home">首页</a>
      <a href="#" id="nav-group">拼团</a>
      <a href="#" id="nav-earn">赚币</a>
      <a href="#" id="nav-exchange">兑换</a>
      <a href="#" id="nav-mine">我的</a>
    </div>
  `;
  bindNavEvents();
  highlightNav("我的页面");
}

// 公共页面模板
function renderPage(title, content) {
  updateTopBar();
  app.innerHTML = `
    <div class="page">
      <h1>${title}</h1>
      <p>${content}</p>
    </div>

    <div class="bottom-nav">
      <a href="#" id="nav-home">首页</a>
      <a href="#" id="nav-group">拼团</a>
      <a href="#" id="nav-earn">赚币</a>
      <a href="#" id="nav-exchange">兑换</a>
      <a href="#" id="nav-mine">我的</a>
    </div>
  `;
  bindNavEvents();
  highlightNav(title);
}

// 导航栏事件
function bindNavEvents() {
  document.getElementById("nav-home").addEventListener("click", () => renderHome());
  document.getElementById("nav-group").addEventListener("click", () => renderGroup());
  document.getElementById("nav-earn").addEventListener("click", () => renderEarn());
  document.getElementById("nav-exchange").addEventListener("click", () => renderExchange());
  document.getElementById("nav-mine").addEventListener("click", () => renderMine());
}

function highlightNav(current) {
  const mapping = {
    "首页": "nav-home",
    "拼团页面": "nav-group",
    "赚币页面": "nav-earn",
    "兑换页面": "nav-exchange",
    "我的页面": "nav-mine",
  };
  const id = mapping[current];
  if (id) document.getElementById(id).classList.add("active");
}

// 初始渲染登录页
renderLogin();
