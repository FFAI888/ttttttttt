const app = document.getElementById("app");
let userAccount = null; // 保存当前钱包地址

// 页面渲染函数
function renderLogin() {
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
        document.getElementById("status").textContent = "钱包已连接: " + userAccount;
        setTimeout(() => renderConfirm(), 1000);
      } catch (err) {
        document.getElementById("status").textContent = "连接失败: " + err.message;
      }
    } else {
      document.getElementById("status").textContent = "未检测到钱包，请安装 MetaMask";
    }
  });
}

function renderConfirm() {
  app.innerHTML = `
    <div class="page">
      <h2>确认关系</h2>
      <p>请确认你要绑定的钱包关系。</p>
      <button id="confirmBtn">确认</button>
    </div>
  `;

  document.getElementById("confirmBtn").addEventListener("click", () => {
    alert("关系已确认！");
    renderHome();
  });
}

function renderHome() {
  renderPage("首页", "欢迎来到应用！");
}

function renderGroup() {
  renderPage("拼团页面", "这里是拼团功能。");
}

function renderEarn() {
  renderPage("赚币页面", "这里是赚币功能。");
}

function renderExchange() {
  renderPage("兑换页面", "这里是兑换功能。");
}

function renderMine() {
  app.innerHTML = `
    <div class="page">
      <h1>我的页面</h1>
      <p>这里是用户个人中心。</p>
      <div class="wallet-address">
        <strong>钱包地址:</strong><br>
        ${userAccount ? userAccount : "未连接"}
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

// 公共页面渲染模板
function renderPage(title, content) {
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

// 绑定导航栏事件
function bindNavEvents() {
  document.getElementById("nav-home").addEventListener("click", () => renderHome());
  document.getElementById("nav-group").addEventListener("click", () => renderGroup());
  document.getElementById("nav-earn").addEventListener("click", () => renderEarn());
  document.getElementById("nav-exchange").addEventListener("click", () => renderExchange());
  document.getElementById("nav-mine").addEventListener("click", () => renderMine());
}

// 高亮当前导航
function highlightNav(current) {
  const mapping = {
    "首页": "nav-home",
    "拼团页面": "nav-group",
    "赚币页面": "nav-earn",
    "兑换页面": "nav-exchange",
    "我的页面": "nav-mine",
  };
  const id = mapping[current];
  if (id) {
    document.getElementById(id).classList.add("active");
  }
}

// 初始渲染登录页
renderLogin();
