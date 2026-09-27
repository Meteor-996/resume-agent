const steps = [
  { title: "输入材料", desc: "告诉我们你的目标与现状" },
  { title: "JD 解析", desc: "拆解岗位真实要求" },
  { title: "简历诊断", desc: "定位差距与修改优先级" },
  { title: "匹配分析", desc: "建立要求与证据映射" },
  { title: "经历追问", desc: "补齐可量化的经历证据" },
  { title: "简历优化", desc: "重构表达并形成终稿" },
  { title: "面试准备", desc: "围绕风险与证据演练" },
  { title: "导出结果", desc: "复制或导出最终材料" }
];

const sampleForm = {
  role: "AI 产品经理",
  industry: "企业服务 / 人工智能",
  companyType: "成长型科技公司",
  stage: "转型求职，已开始投递",
  strengths: "ToB 产品规划、复杂业务抽象、跨部门推进、数据分析、0-1 产品落地",
  jd: `岗位职责：
1. 负责企业级 AI 产品的规划、设计与迭代，深入理解客户业务场景；
2. 结合大语言模型能力，设计智能问答、知识库、Agent 等产品方案；
3. 协同算法、研发、设计和业务团队推动产品从 0 到 1 落地；
4. 建立产品数据指标体系，基于用户反馈与数据持续优化体验；
5. 跟踪生成式 AI 与行业趋势，形成产品洞察。

任职要求：
1. 3 年以上 B 端产品经验，有复杂业务系统或 SaaS 产品经验；
2. 熟悉 LLM、RAG、Prompt Engineering、AI Agent 等基本原理和应用边界；
3. 具备优秀的需求分析、产品设计、项目管理和跨团队协作能力；
4. 有 AI 产品落地、知识库或智能助手项目经验优先；
5. 数据敏感，能够定义并分析产品核心指标。`,
  resume: `陈默｜产品经理｜4 年经验

某企业软件公司  产品经理  2022.03-至今
- 负责 ERP 采购、库存模块的产品设计和版本迭代
- 对接客户需求，与研发和测试协作推进项目上线
- 搭建经营数据报表，支持管理层查看业务数据
- 参与 WMS 系统升级，优化仓库作业流程

某供应链科技公司  产品助理  2020.07-2022.02
- 协助完成产品需求文档和原型设计
- 跟进项目进度，收集用户反馈

技能：Axure、Figma、SQL、Excel、XMind
教育：华东理工大学 信息管理与信息系统 本科`,
  extra: "ERP 覆盖约 20 家客户；经营报表日活大约 300 人。最近自学了 RAG 和 Prompt，并用 Dify 做过内部知识库 Demo，但还没有正式上线。WMS 项目上线后，仓库盘点时间从 2 天缩短到半天。"
};

const state = {
  currentStep: 0,
  analyzed: false,
  analyzing: false,
  mobileNav: false,
  visited: new Set([0]),
  mode: "balanced",
  answers: Array(7).fill(""),
  bullets: Array(7).fill(""),
  openInterview: new Set([0]),
  form: { role: "", industry: "", companyType: "", stage: "", strengths: "", jd: "", resume: "", extra: "" }
};

const questions = [
  { tag: "业务结果", title: "WMS 升级具体优化了哪些作业环节？上线前后的效率数据是什么？", reason: "JD 强调数据结果，目前简历只有“优化流程”，证据不足。", placeholder: "例如：重构入库、盘点流程；盘点从 2 天缩短至半天……" },
  { tag: "项目规模", title: "ERP 产品覆盖多少客户、用户或业务单据？你负责的模块占多大范围？", reason: "用产品规模证明复杂 B 端系统经验。", placeholder: "例如：服务 20 家制造企业、月均处理 12 万条采购单……" },
  { tag: "个人贡献", title: "经营报表项目中，你独立完成了哪些关键决策？", reason: "区分团队成果与个人贡献，避免职责表述过于宽泛。", placeholder: "例如：独立梳理 4 类角色、定义 23 个核心指标……" },
  { tag: "AI 实践", title: "内部知识库 Demo 解决了什么问题？知识来源、技术链路和评测方式是什么？", reason: "这是转型 AI 产品经理最关键的迁移证据。", placeholder: "例如：基于 Dify + 企业文档搭建，测试 50 个高频问题……" },
  { tag: "协作推进", title: "最复杂的一次跨部门分歧是什么？你如何推动达成一致？", reason: "JD 需要跨算法、研发与业务协同的推进能力。", placeholder: "例如：在交付期限与数据准确性之间设计分期方案……" },
  { tag: "用户洞察", title: "你如何收集和判断客户需求？有多少需求被验证或被你否决？", reason: "展示需求分析不是被动接单，而是有判断和取舍。", placeholder: "例如：访谈 12 名仓管与主管，合并 30 条反馈为 5 类核心问题……" },
  { tag: "指标体系", title: "经营报表上线后，用户使用和决策效率发生了什么变化？", reason: "补齐数据指标定义与持续迭代能力。", placeholder: "例如：日活 300 人，月报制作耗时由 3 天缩至 4 小时……" }
];

const matchRows = [
  ["3 年以上 ToB 产品经验", "4 年 ERP / WMS 产品经验", "强", "否", "在职业摘要首句明确“4 年企业级产品经验”"],
  ["复杂业务系统 / SaaS", "采购、库存、仓储作业与经营报表", "强", "否", "补充客户数、用户量、流程复杂度"],
  ["AI 产品规划与落地", "Dify 知识库 Demo、自学 RAG / Prompt", "弱", "是", "用问题、方案、评测、迭代四段式描述 Demo"],
  ["LLM / RAG / Agent 原理", "简历未体现", "缺失", "是", "补充实践边界，不写“精通”"],
  ["0-1 产品落地", "经营报表搭建、WMS 升级", "中", "是", "明确从调研到上线的完整责任链"],
  ["数据指标体系", "经营数据报表、SQL / Excel", "中", "是", "补充指标口径、使用率与业务结果"],
  ["跨团队协作", "与研发、测试和客户协作", "中", "是", "补充团队规模、冲突与推进方法"],
  ["行业趋势洞察", "简历未体现", "缺失", "是", "可在项目中补充 AI 方案选型与竞品研究" ]
];

const optimizeData = {
  balanced: [
    ["负责 ERP 采购、库存模块的产品设计和版本迭代", "负责面向 20 家企业客户的 ERP 采购与库存模块，梳理订单、入库、盘点等核心流程，持续推动版本迭代与客户落地。", "补充产品范围与客户规模，体现复杂业务抽象能力。", "20 家客户需可核实"],
    ["搭建经营数据报表，支持管理层查看业务数据", "从 0 到 1 搭建经营分析报表，定义采购、库存与履约等核心指标口径，服务约 300 名日活用户，提升管理层经营决策效率。", "从“做功能”升级为“指标定义 + 用户价值”。", "需补充效率提升数据"],
    ["参与 WMS 系统升级，优化仓库作业流程", "主导 WMS 盘点流程升级，通过现场调研重构任务分配与复核机制，将单仓盘点周期由 2 天缩短至 0.5 天。", "突出个人责任与可量化业务结果。", "确认“主导”与数据口径"],
    ["用 Dify 做过内部知识库 Demo", "基于 Dify 搭建企业知识库 Demo，完成文档切分、召回策略与 Prompt 配置，并围绕高频业务问题设计基础评测集，验证 RAG 在内部知识检索场景的可行性。", "将学习经历转为完整的 AI 产品实践链路。", "不可包装为已上线项目"]
  ],
  concise: [
    ["负责 ERP 采购、库存模块的产品设计和版本迭代", "负责 ERP 采购与库存模块，服务 20 家企业客户，持续推动核心流程迭代与交付。", "删减过程性描述，保留范围和结果。", "20 家客户需可核实"],
    ["搭建经营数据报表，支持管理层查看业务数据", "0-1 搭建经营分析报表，定义核心指标，服务约 300 名日活用户。", "压缩为一行高密度信息。", "补充决策效率数据更佳"],
    ["参与 WMS 系统升级，优化仓库作业流程", "推动 WMS 盘点流程升级，将单仓盘点由 2 天缩短至 0.5 天。", "只保留动作与量化结果。", "明确个人贡献边界"],
    ["用 Dify 做过内部知识库 Demo", "基于 Dify 搭建 RAG 知识库 Demo，完成数据处理、Prompt 配置与基础评测。", "保留 AI 技术关键词与实践范围。", "注明 Demo 未上线"]
  ],
  cautious: [
    ["负责 ERP 采购、库存模块的产品设计和版本迭代", "参与 ERP 采购与库存模块规划和迭代，支持约 20 家企业客户的需求分析与项目交付。", "降低对项目所有权的推断，表述更稳健。", "面试需说明实际负责边界"],
    ["搭建经营数据报表，支持管理层查看业务数据", "参与经营分析报表从 0 到 1 建设，协助梳理核心指标口径，当前约有 300 名日活用户。", "避免在缺少证据时放大个人决策权。", "数据应说明统计时间"],
    ["参与 WMS 系统升级，优化仓库作业流程", "参与 WMS 盘点流程升级，协同仓储团队优化任务与复核方式，盘点周期由 2 天缩短至约 0.5 天。", "用“参与 / 协同”匹配原始材料。", "确认改善是否可归因于产品改造"],
    ["用 Dify 做过内部知识库 Demo", "使用 Dify 完成内部知识库概念验证，初步实践文档处理、检索配置与 Prompt 调优。", "明确是概念验证，避免被理解为生产项目。", "不应写正式上线或业务收益"]
  ],
  ai: [
    ["负责 ERP 采购、库存模块的产品设计和版本迭代", "负责企业级 ERP 采购与库存产品，将复杂业务规则抽象为可配置产品能力，为 AI 场景设计积累了业务建模与结构化知识经验。", "建立传统 ToB 经历向 AI 产品能力的迁移关系。", "避免强行关联，面试要能解释迁移逻辑"],
    ["搭建经营数据报表，支持管理层查看业务数据", "0-1 搭建经营分析产品，完成多源数据指标定义与可视化呈现，服务约 300 名日活用户，为后续智能问数场景沉淀结构化数据基础。", "突出数据产品经验和 AI 延展空间。", "“智能问数”只能表述为后续场景"],
    ["参与 WMS 系统升级，优化仓库作业流程", "主导 WMS 盘点流程数字化升级，将单仓盘点由 2 天缩短至 0.5 天，并沉淀可用于智能作业助手的标准流程与异常场景。", "体现场景理解与知识结构化能力。", "智能助手需说明尚未落地"],
    ["用 Dify 做过内部知识库 Demo", "基于 Dify 设计企业知识库 Agent 原型，完成文档切分、召回配置、Prompt 编排与高频问题评测，验证 RAG 在内部知识检索中的可行性与回答边界。", "完整呈现 AI 产品方案、实现和评测意识。", "需准备评测集规模与失败案例"]
  ],
  tob: [
    ["负责 ERP 采购、库存模块的产品设计和版本迭代", "负责面向 20 家企业客户的 ERP 采购与库存产品，抽象多行业流程差异并沉淀配置化方案，平衡标准产品演进与客户交付。", "强化 ToB 产品的标准化与定制化平衡。", "准备典型客户差异案例"],
    ["搭建经营数据报表，支持管理层查看业务数据", "搭建企业经营分析产品，统一采购、库存与履约指标口径，覆盖管理层与业务人员约 300 名日活用户。", "突出多角色、指标治理与企业应用规模。", "补充角色差异与权限设计"],
    ["参与 WMS 系统升级，优化仓库作业流程", "深入仓储现场完成 WMS 盘点流程升级，协同实施与研发推动方案落地，将单仓盘点周期由 2 天缩短至 0.5 天。", "体现 ToB 产品现场调研与交付闭环。", "说明客户验收方式"],
    ["用 Dify 做过内部知识库 Demo", "围绕企业知识复用场景搭建 Dify 知识库 Demo，验证权限、知识更新与答案可追溯等 ToB 核心需求。", "把 AI 实践放入企业级产品语境。", "若未验证权限能力需删减"]
  ]
};

const interviewQuestions = [
  ["转型动机", "为什么从 ERP / WMS 产品经理转向 AI 产品经理？", "准备一条连续的职业叙事：复杂业务建模 → 数据产品 → RAG 知识库实践。重点说明 AI 是能力延展，不是追逐热点。"],
  ["AI 实践", "请完整介绍你的企业知识库 Demo，你解决了什么问题？", "按问题定义、用户与场景、方案选型、知识处理、评测、失败案例和下一步计划回答。"],
  ["技术理解", "RAG 为什么会出现召回正确但回答错误？你会如何排查？", "准备检索、上下文、Prompt、模型能力和评测集五层排查框架，并给出亲自遇到的例子。"],
  ["产品设计", "如果让你设计一个企业内部智能问答产品，你会如何从 0 到 1 推进？", "覆盖用户调研、场景优先级、数据准备、权限、评测、灰度上线和效果指标。"],
  ["业务成果", "WMS 盘点效率提升 75% 的数据是如何统计的？", "说清改造前后样本、时间范围、其他变量，以及你个人负责的环节。"],
  ["需求判断", "企业客户的需求很多且相互冲突，你如何判断优先级？", "用真实案例说明价值、通用性、紧急度、成本与战略匹配的判断过程。"],
  ["指标体系", "AI 产品应该关注哪些指标？与传统 SaaS 有什么区别？", "准备业务效果、任务完成率、采纳率、响应质量、召回质量、成本与延迟的指标树。"],
  ["协同推进", "当算法效果达不到业务方预期时，你如何管理预期并推进上线？", "说明如何建立可量化基线、定义上线边界、设计人工兜底与迭代机制。"],
  ["风险意识", "大模型在企业场景落地有哪些风险？", "从幻觉、权限与隐私、数据时效、可解释性、成本和合规六方面回答。"],
  ["岗位匹配", "你没有正式上线的 AI 项目，我们为什么要选择你？", "坦诚经验边界，用 ToB 场景深度、0-1 推进、数据能力和快速验证的证据回应。"]
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function appTemplate(content) {
  const progress = state.analyzed ? Math.max(13, Math.round(((state.currentStep + 1) / steps.length) * 100)) : 6;
  return `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <button class="icon-button mobile-menu" data-action="toggle-nav" aria-label="打开流程导航">☰</button>
          <div class="brand-mark">简</div>
          <div class="brand-name">简历专家<span class="brand-sub">JD 定制优化 Agent</span></div>
        </div>
        <div class="top-status">
          <span class="status-dot"></span>
          <span>${state.analyzed ? "本地分析已完成" : "本地模式 · 数据不会上传"}</span>
          <button class="icon-button" data-action="help" aria-label="查看使用说明">?</button>
        </div>
      </header>
      <aside class="sidebar ${state.mobileNav ? "open" : ""}">
        <div class="sidebar-label">优化流程</div>
        <nav class="step-nav" aria-label="简历优化流程">
          ${steps.map((step, index) => {
            const locked = !state.analyzed && index > 0;
            const completed = state.analyzed && state.visited.has(index) && index !== state.currentStep;
            return `<button class="step-item ${index === state.currentStep ? "active" : ""} ${locked ? "locked" : ""} ${completed ? "completed" : ""}" data-step="${index}" ${locked ? "aria-disabled=\"true\"" : ""}>
              <span class="step-number">${completed ? "✓" : index + 1}</span>
              <span>${step.title}</span>
              <span class="step-check">${completed ? "" : index === state.currentStep ? "›" : ""}</span>
            </button>`;
          }).join("")}
        </nav>
        <div class="sidebar-progress">
          <div class="progress-copy"><span>完成进度</span><span>${progress}%</span></div>
          <div class="progress-track" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
      </aside>
      <main class="main"><div class="workspace">${content}</div></main>
    </div>`;
}

function pageHeader(step, title, desc, meta = "") {
  return `<div class="page-header">
    <div><div class="eyebrow">STEP ${String(step + 1).padStart(2, "0")} / 08</div><h1>${title}</h1><p class="page-desc">${desc}</p></div>
    ${meta ? `<div class="header-meta">${meta}</div>` : ""}
  </div>`;
}

function inputPage() {
  if (state.analyzing) {
    return `${pageHeader(0, "正在建立岗位与经历模型", "Agent 正在从岗位要求、简历证据和能力迁移三个方向同步分析。")}
      <div class="card loading-panel"><div class="loader"></div><div class="loading-title">正在分析你的材料</div><div id="loading-step" class="loading-step">解析 JD 关键词与能力结构…</div></div>`;
  }
  const f = state.form;
  return `${pageHeader(0, "先理解岗位，再重写简历", "提供目标岗位与原始经历。分析在本地以示例逻辑运行，不会上传你的信息。", `<span class="badge">预计 2 分钟</span>`)}
    <div class="card section">
      <div class="section-head"><div><h2>求职目标</h2><div class="section-kicker">用于确定表达方向和评估标准</div></div></div>
      <div class="form-grid">
        ${field("role", "目标岗位", f.role, "text", "例如：AI 产品经理")}
        ${field("industry", "目标行业", f.industry, "text", "例如：企业服务 / 人工智能")}
        ${field("companyType", "公司类型", f.companyType, "select", "", ["请选择", "成长型科技公司", "大型互联网公司", "成熟企业 / 集团", "创业公司", "不限"])}
        ${field("stage", "求职阶段", f.stage, "select", "", ["请选择", "方向探索", "准备简历", "转型求职，已开始投递", "面试进行中", "在职看机会"])}
        <div class="field full"><label for="strengths">希望突出能力 <span class="field-note">用顿号分隔</span></label><input id="strengths" class="input" data-field="strengths" value="${escapeHtml(f.strengths)}" placeholder="例如：产品规划、业务抽象、数据分析" /></div>
      </div>
    </div>
    <div class="card section">
      <div class="section-head"><div><h2>岗位与简历</h2><div class="section-kicker">材料越完整，分析越贴近真实岗位</div></div><span class="badge green">仅本地处理</span></div>
      <div class="form-grid">
        <div class="field"><label for="jd">目标 JD <span class="field-note"><span id="jd-count">${f.jd.length}</span> 字</span></label><textarea id="jd" class="textarea tall" data-field="jd" placeholder="粘贴完整的岗位职责和任职要求…">${escapeHtml(f.jd)}</textarea></div>
        <div class="field"><label for="resume">原始简历 <span class="field-note"><span id="resume-count">${f.resume.length}</span> 字</span></label><textarea id="resume" class="textarea tall" data-field="resume" placeholder="粘贴你的原始简历文本…">${escapeHtml(f.resume)}</textarea></div>
        <div class="field full"><label for="extra">补充信息 <span class="field-note">可选</span></label><textarea id="extra" class="textarea" data-field="extra" placeholder="补充暂未写进简历的项目、数据、AI 实践或求职顾虑…">${escapeHtml(f.extra)}</textarea></div>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn" data-action="sample">使用示例数据</button>
      <div class="action-group"><button class="btn ghost" data-action="clear">清空</button><button class="btn primary" data-action="analyze">开始分析 <span>→</span></button></div>
    </div>`;
}

function field(key, label, value, type, placeholder, options = []) {
  if (type === "select") {
    return `<div class="field"><label for="${key}">${label}</label><select id="${key}" class="select" data-field="${key}">${options.map(o => `<option ${o === value ? "selected" : ""}>${o}</option>`).join("")}</select></div>`;
  }
  return `<div class="field"><label for="${key}">${label}</label><input id="${key}" class="input" data-field="${key}" value="${escapeHtml(value)}" placeholder="${placeholder}" /></div>`;
}

function jdPage() {
  return `${pageHeader(1, "JD 解析", "把岗位描述转化为可执行的简历优化标准。", `<span class="badge accent">目标岗位：${escapeHtml(state.form.role || "AI 产品经理")}</span>`)}
    <div class="grid-4">
      ${stat("5 项", "核心职责", "以 AI 产品落地为主线")}${stat("5 项", "硬性要求", "ToB 与 AI 能力并重")}${stat("12 个", "高频关键词", "建议自然融入简历")}${stat("3 项", "隐性要求", "业务判断、边界意识、推进力")}
    </div>
    <div class="split" style="margin-top:16px">
      <section class="card section"><h2>核心职责</h2><ol class="ordered-list"><li>深入企业客户场景，规划并迭代 AI 产品</li><li>设计智能问答、知识库与 Agent 解决方案</li><li>协同算法、研发、设计与业务推动 0-1 落地</li><li>建立指标体系并基于反馈持续优化</li><li>跟踪生成式 AI 趋势并转化为产品洞察</li></ol></section>
      <section class="card section"><h2>隐性要求</h2><ul class="list-clean"><li><strong>能连接技术与业务：</strong>不要求训练模型，但需要理解 LLM 能力边界并完成产品化。</li><li><strong>企业级交付意识：</strong>关注权限、准确性、可追溯、成本和上线风险。</li><li><strong>结果导向：</strong>不仅交付功能，还要能定义业务价值与效果指标。</li></ul></section>
    </div>
    <section class="card section"><div class="section-head"><div><h2>岗位关键词</h2><div class="section-kicker">按重要度排序，需基于真实经历自然出现</div></div></div><div class="tag-list">${["AI 产品规划", "企业级产品", "LLM", "RAG", "AI Agent", "知识库", "0-1 落地", "需求分析", "指标体系", "跨团队协作", "Prompt Engineering", "SaaS"].map((x,i)=>`<span class="keyword">${x}${i<4?" · 核心":""}</span>`).join("")}</div></section>
    <section class="card section"><div class="section-head"><div><h2>核心能力模型</h2><div class="section-kicker">面试官会用这些维度综合判断候选人</div></div></div>
      <div class="table-wrap"><table><thead><tr><th>能力维度</th><th>岗位期待</th><th>判断信号</th><th>权重</th></tr></thead><tbody>
        ${[["AI 产品认知","理解 LLM / RAG / Agent 的适用场景与边界","有真实原型、评测或落地案例","25%"],["ToB 场景能力","理解复杂业务流程与企业级产品特性","ERP / WMS / SaaS 产品经验","20%"],["产品落地能力","能从需求到上线闭环推进","0-1 项目、跨团队协作、结果数据","20%"],["数据与迭代","能定义指标并用数据驱动优化","指标体系、SQL、用户反馈闭环","15%"],["业务洞察","从客户问题中识别高价值机会","调研、取舍、方案判断","10%"],["学习迁移","快速建立新领域认知并付诸实践","AI 自学与项目化验证","10%"]].map(r=>`<tr><td><div class="cell-title">${r[0]}</div></td><td>${r[1]}</td><td>${r[2]}</td><td><strong>${r[3]}</strong></td></tr>`).join("")}
      </tbody></table></div>
    </section>
    <section class="card section"><h2>理想候选人画像</h2><div class="insight">具备 3-5 年企业级产品经验，能深入复杂业务并抽象为标准产品；理解大模型应用链路，亲自完成过 AI 原型或产品验证；同时能用清晰指标证明上线价值，并对 AI 的准确性、权限和成本边界保持判断力。</div></section>`;
}

function stat(value, label, context) {
  return `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-context">${context}</div></div>`;
}

function diagnosisPage() {
  const dims = [["ToB 经验",88],["业务理解",84],["数据能力",72],["项目推进",76],["AI 实践",46],["技术理解",42]];
  return `${pageHeader(2, "简历诊断", "先解决影响岗位匹配的关键问题，再处理措辞和格式。", `<span class="badge yellow">当前版本 · 有潜力但证据不足</span>`)}
    <section class="card section"><div class="score-layout">
      <div class="score-ring" style="--score:68"><div class="score-inner"><div class="score-number">68</div><div class="score-unit">综合匹配度 / 100</div></div></div>
      <div><h2>岗位基础匹配，但 AI 转型证据偏弱</h2><p class="page-desc" style="margin-bottom:18px">你的 ToB 业务经验是明显优势。当前失分主要不是能力不足，而是简历没有证明你如何把复杂业务、数据能力迁移到 AI 产品场景。</p><div class="dimension-list">${dims.map(d=>`<div class="dimension-row"><span class="dimension-name">${d[0]}</span><div class="bar ${d[1]<60?"warning":""}"><span style="width:${d[1]}%"></span></div><span class="dimension-score">${d[1]}</span></div>`).join("")}</div></div>
    </div></section>
    <div class="split">
      <section class="card section"><h2>主要问题</h2><ul class="list-clean"><li><strong>AI 经历停留在技能词：</strong>没有呈现知识库 Demo 的问题、方案、评测与边界。</li><li><strong>业务结果缺少数据：</strong>多处使用“负责、参与、支持”，无法判断影响规模。</li><li><strong>个人贡献不清：</strong>没有区分团队成果和你主导的关键决策。</li><li><strong>经历缺少主线：</strong>ERP、WMS、报表尚未被组织成转型 AI 产品的可迁移能力。</li></ul></section>
      <section class="card section"><h2>已有优势</h2><ul class="list-clean"><li><strong>复杂 ToB 场景：</strong>采购、库存、仓储均具有较高业务规则密度。</li><li><strong>完整协作基础：</strong>有客户、研发、测试等多角色推进经验。</li><li><strong>数据产品底子：</strong>经营报表与 SQL 能支撑 AI 产品指标意识。</li><li><strong>主动实践信号：</strong>已用 Dify 验证知识库场景，可深挖为重点项目。</li></ul></section>
    </div>
    <section class="card section"><div class="section-head"><div><h2>优先修改建议</h2><div class="section-kicker">按对匹配度的预期影响排序</div></div></div>
      <div class="table-wrap"><table><thead><tr><th>优先级</th><th>修改动作</th><th>预期影响</th><th>需要补充</th></tr></thead><tbody>
        <tr><td><span class="badge red">P0</span></td><td><div class="cell-title">重构 AI 知识库 Demo</div><div class="cell-sub">按场景、方案、评测、迭代描述</div></td><td>显著提升 AI 实践可信度</td><td>问题规模、评测集、效果与失败案例</td></tr>
        <tr><td><span class="badge yellow">P1</span></td><td><div class="cell-title">量化 WMS 与经营报表成果</div></td><td>证明产品落地与数据能力</td><td>上线前后效率、用户规模</td></tr>
        <tr><td><span class="badge yellow">P1</span></td><td><div class="cell-title">增加职业摘要与能力迁移主线</div></td><td>降低转型岗位的理解成本</td><td>目标方向与核心优势</td></tr>
        <tr><td><span class="badge">P2</span></td><td><div class="cell-title">压缩早期产品助理经历</div></td><td>为高价值项目释放版面</td><td>保留一项代表性成果即可</td></tr>
      </tbody></table></div>
    </section>`;
}

function matchPage() {
  const strengthBadge = value => value === "强" ? "green" : value === "中" ? "yellow" : value === "弱" ? "red" : "";
  return `${pageHeader(3, "匹配分析", "逐项核对岗位要求、现有证据和需要补齐的信息。", `<span class="badge green">强证据 2</span><span class="badge yellow">待加强 4</span><span class="badge red">缺失 2</span>`)}
    <div class="grid-3"><div class="stat-card"><div class="stat-label">已覆盖要求</div><div class="stat-value">6 / 8</div><div class="stat-context">覆盖不等于证据充分</div></div><div class="stat-card"><div class="stat-label">强证据比例</div><div class="stat-value">25%</div><div class="stat-context">建议提升至 50% 以上</div></div><div class="stat-card"><div class="stat-label">最大差距</div><div class="stat-value" style="font-size:18px">AI 落地经验</div><div class="stat-context">可通过现有 Demo 深挖补齐</div></div></div>
    <section class="card section" style="margin-top:16px"><div class="section-head"><div><h2>要求与证据映射</h2><div class="section-kicker">“缺失”不代表必须编造经历，而是需要寻找可迁移证据或明确学习计划</div></div></div>
      <div class="table-wrap"><table><thead><tr><th>JD 要求</th><th>简历证据</th><th>证据强度</th><th>是否补充</th><th>优化建议</th></tr></thead><tbody>${matchRows.map(r=>`<tr><td><div class="cell-title">${r[0]}</div></td><td>${r[1]}</td><td><span class="badge ${strengthBadge(r[2])}">${r[2]}</span></td><td>${r[3]==="是"?`<span class="badge yellow">是</span>`:`<span class="badge green">否</span>`}</td><td>${r[4]}</td></tr>`).join("")}</tbody></table></div>
    </section>
    <section class="card section"><h2>匹配策略</h2><div class="insight">不要把自己包装成资深 AI 产品经理。更可信的定位是：<strong>具备复杂 ToB 业务与产品落地经验、已经完成 AI 知识库实践、正在向 AI 产品迁移的产品经理</strong>。这能保留优势，也减少面试中的履历风险。</div></section>`;
}

function questionsPage() {
  const done = state.bullets.filter(Boolean).length;
  return `${pageHeader(4, "经历追问", "回答关键问题，把模糊职责转成可信、可量化的简历证据。", `<span class="badge accent">已生成 ${done} / ${questions.length} 条表达</span>`)}
    <section class="card section"><div class="section-head"><div><h2>优先补充的经历证据</h2><div class="section-kicker">不必一次写完。优先回答与你掌握的数据最接近的问题。</div></div><button class="btn small" data-action="fill-answers">填入示例回答</button></div><div class="warning-box">请只填写真实信息。Agent 会优化表达结构，但不会替你验证数据或扩大个人贡献。</div></section>
    <div class="question-list">${questions.map((q,i)=>`<section class="card question-card"><div class="question-top"><span class="question-index">${i+1}</span><div><div class="question-title">${q.title}</div><div class="question-reason">${q.reason}</div></div><span class="badge ${state.bullets[i]?"green":""}">${state.bullets[i]?"已生成":q.tag}</span></div><div class="answer-row"><textarea class="textarea answer-textarea" data-answer="${i}" placeholder="${q.placeholder}">${escapeHtml(state.answers[i])}</textarea><button class="btn small ${state.answers[i]?"primary":""}" data-generate="${i}" ${state.answers[i].trim()?"":"disabled"}>生成 bullet</button></div>${state.bullets[i]?`<div class="generated-bullet"><strong>可用于简历</strong>${escapeHtml(state.bullets[i])}</div>`:""}</section>`).join("")}</div>
    <div class="form-actions" style="margin-top:18px"><span class="page-desc">已保存的回答会同步进入优化版简历。</span><button class="btn primary" data-step="5">进入简历优化 →</button></div>`;
}

function optimizationPage() {
  const modes = [["balanced","平衡表达"],["concise","更简洁"],["cautious","降低夸张"],["ai","更偏 AI 产品"],["tob","更偏 ToB SaaS"]];
  const rows = optimizeData[state.mode];
  return `${pageHeader(5, "简历优化", "对照每一处修改，理解表达提升和真实性风险。", `<span class="badge green">基于 JD 定制</span>`)}
    <section class="card section"><div class="section-head"><div><h2>表达方向</h2><div class="section-kicker">切换后可即时查看同一经历的不同表达策略</div></div><div class="segmented" aria-label="表达方向">${modes.map(m=>`<button class="segment ${state.mode===m[0]?"active":""}" data-mode="${m[0]}">${m[1]}</button>`).join("")}</div></div>
      <div class="table-wrap"><table class="compare-table"><thead><tr><th>修改前</th><th>修改后</th><th>修改理由</th><th>风险提示</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="before-text">${r[0]}</td><td class="after-text">${r[1]}</td><td>${r[2]}</td><td class="risk">${r[3]}</td></tr>`).join("")}</tbody></table></div>
    </section>
    <section class="card section"><div class="section-head"><div><h2>职业摘要建议</h2><div class="section-kicker">用 3-4 行建立清晰的转型叙事</div></div><button class="btn small" data-copy="summary">复制</button></div><div class="insight" id="summary-text">4 年企业级产品经验，覆盖 ERP、WMS 与经营数据产品，擅长复杂业务流程抽象、0-1 产品建设及跨团队落地。具备 SQL 数据分析能力，并完成基于 Dify 的企业知识库 RAG 原型实践。希望将 ToB 场景理解与产品交付经验迁移至 AI 产品，推动大模型能力在企业场景中可靠落地。</div></section>
    <section class="card section"><div class="section-head"><div><h2>完整优化版简历</h2><div class="section-kicker">已整合岗位关键词、现有经历与补充证据</div></div><div class="action-group"><button class="btn small" data-copy="resume">复制全文</button><button class="btn small primary" data-step="6">准备面试 →</button></div></div><div class="warning-box">下方终稿中的数据来自示例材料。正式投递前，请逐条确认数据、角色与结果均可在面试中解释。</div></section>
    ${resumePaper()}`;
}

function resumePaper() {
  const customBullets = state.bullets.filter(Boolean).slice(0, 3);
  return `<article class="resume-paper" id="final-resume">
    <header><h1 class="resume-name">陈默</h1><div class="resume-target">AI 产品经理｜企业级 AI 应用方向</div><div class="resume-contact"><span>138-0000-0000</span><span>chenmo@example.com</span><span>上海</span><span>4 年产品经验</span></div></header>
    <section class="resume-section"><h2>职业摘要</h2><p>4 年企业级产品经验，覆盖 ERP、WMS 与经营数据产品，擅长复杂业务流程抽象、0-1 产品建设及跨团队落地。具备 SQL 数据分析能力，并完成基于 Dify 的企业知识库 RAG 原型实践。希望将 ToB 场景理解与产品交付经验迁移至 AI 产品，推动大模型能力在企业场景中可靠落地。</p></section>
    <section class="resume-section"><h2>核心能力</h2><dl class="resume-skills"><dt>产品能力</dt><dd>产品规划、需求分析、业务流程抽象、原型设计、项目管理、数据指标体系</dd><dt>AI 应用</dt><dd>LLM 应用认知、RAG 知识库、Prompt 设计、Dify、基础评测设计</dd><dt>ToB 场景</dt><dd>ERP 采购与库存、WMS 仓储、经营分析、企业客户交付</dd><dt>工具技能</dt><dd>Axure、Figma、SQL、Excel、XMind</dd></dl></section>
    <section class="resume-section"><h2>工作经历</h2>
      <div class="experience"><div class="experience-head"><div><span class="experience-company">某企业软件公司</span><span class="experience-role">产品经理</span></div><span class="experience-date">2022.03 - 至今</span></div><ul class="resume-bullets"><li>负责面向 20 家企业客户的 ERP 采购与库存模块，梳理订单、入库、盘点等核心流程，持续推动版本迭代与客户落地。</li><li>从 0 到 1 搭建经营分析报表，定义采购、库存与履约等核心指标口径，服务约 300 名日活用户。</li><li>推动 WMS 盘点流程升级，通过现场调研优化任务分配与复核机制，将单仓盘点周期由 2 天缩短至 0.5 天。</li><li>协同研发、测试与实施推进多客户项目交付，平衡标准产品演进与差异化需求。</li>${customBullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul></div>
      <div class="experience"><div class="experience-head"><div><span class="experience-company">某供应链科技公司</span><span class="experience-role">产品助理</span></div><span class="experience-date">2020.07 - 2022.02</span></div><ul class="resume-bullets"><li>参与供应链产品需求分析、原型设计和版本验收，持续收集用户反馈并跟踪问题闭环。</li></ul></div>
    </section>
    <section class="resume-section"><h2>项目经历</h2><div class="experience"><div class="experience-head"><div><span class="experience-company">企业知识库 RAG 原型</span><span class="experience-role">独立实践</span></div><span class="experience-date">2025</span></div><ul class="resume-bullets"><li>围绕内部制度与产品文档检索场景，基于 Dify 搭建企业知识库 Demo，完成文档切分、召回策略和 Prompt 配置。</li><li>整理高频业务问题并设计基础评测集，验证 RAG 在知识检索场景的可行性，识别知识时效、召回遗漏与回答幻觉等关键风险。</li><li>结合 ToB 产品经验，梳理权限控制、知识更新、答案可追溯与人工兜底等企业级产品需求。</li></ul></div></section>
    <section class="resume-section"><h2>教育背景</h2><div class="experience-head"><div><span class="experience-company">华东理工大学</span><span class="experience-role">信息管理与信息系统 · 本科</span></div><span class="experience-date">2016.09 - 2020.06</span></div></section>
  </article>`;
}

function interviewPage() {
  return `${pageHeader(6, "面试准备", "围绕岗位匹配、AI 实践与简历风险，准备能被追问的证据。", `<span class="badge accent">10 个高概率问题</span>`)}
    <div class="split">
      <section class="card section"><h2>需要准备的证据</h2><ul class="list-clean"><li>知识库 Demo 的产品流程图、核心配置与 3 个失败案例</li><li>WMS 盘点改造前后流程与数据统计口径</li><li>经营报表核心指标清单及用户角色差异</li><li>一次需求取舍或跨部门冲突的完整复盘</li></ul></section>
      <section class="card section"><h2>建议补充的数据</h2><ul class="list-clean"><li>ERP 月活用户、单据量或续费 / 验收情况</li><li>经营报表使用频次与决策耗时变化</li><li>知识库测试问题数量、命中率与人工评价</li><li>你直接协作的研发、测试和业务团队规模</li></ul></section>
    </div>
    <section class="card section"><h2>可能夸大的表达</h2><div class="warning-box"><strong>重点核对：</strong>“主导 WMS 升级”“定义全部指标”“服务 20 家客户”“盘点效率提升 75%”。如果你只负责其中一部分，应改为“负责某模块 / 参与 / 协同”，并在面试中清晰说明归因边界。</div></section>
    <section class="section" style="padding-left:0;padding-right:0"><div class="section-head"><div><h2>高概率面试问题</h2><div class="section-kicker">点击问题查看准备要点</div></div><button class="btn small" data-action="expand-all">全部展开</button></div><div class="interview-list">${interviewQuestions.map((q,i)=>`<div class="interview-item"><button class="interview-question" data-interview="${i}" aria-expanded="${state.openInterview.has(i)}"><span class="question-index">${i+1}</span><span><span class="question-type">${q[0]}</span><span class="cell-title">${q[1]}</span></span><span>${state.openInterview.has(i)?"−":"+"}</span></button><div class="interview-answer" ${state.openInterview.has(i)?"":"hidden"}>${q[2]}</div></div>`).join("")}</div></section>
    <section class="card section"><div class="section-head"><div><h2>90 秒自我介绍</h2><div class="section-kicker">按背景、优势、转型证据和岗位动机组织</div></div><button class="btn small" data-copy="intro">复制</button></div><div class="self-intro" id="intro-text">面试官您好，我叫陈默，有 4 年企业级产品经验，主要负责 ERP 采购库存、WMS 和经营数据产品。

过去的工作让我比较擅长两件事：一是深入复杂业务，把采购、库存和仓储流程抽象成可落地的产品方案；二是推动多角色协作，把产品从需求、设计一直推进到上线，并用数据验证结果。比如在 WMS 盘点项目中，我们将单仓盘点周期从 2 天缩短到半天。

在这个基础上，我开始系统学习大模型产品，并用 Dify 搭建了企业知识库 Demo，实践了文档处理、RAG、Prompt 配置和基础评测。我也意识到 AI 产品不只是接入模型，更重要的是场景选择、效果评测和企业级风险控制。

我希望应聘 AI 产品经理，是想把已有的 ToB 场景理解和交付能力，与大模型应用结合起来，推动 AI 在真实企业场景中产生可衡量的价值。</div></section>
    <div class="form-actions"><span></span><button class="btn primary" data-step="7">导出结果 →</button></div>`;
}

function exportPage() {
  return `${pageHeader(7, "导出结果", "带走你的定制简历与面试材料，正式投递前请完成真实性复核。", `<span class="badge green">全部流程已完成</span>`)}
    <section class="card section"><div class="section-head"><div><h2>最终检查</h2><div class="section-kicker">根据当前材料自动生成</div></div></div><div class="grid-4"><div><span class="badge green">✓ 已完成</span><h3 style="margin-top:9px">JD 关键词覆盖</h3><p class="page-desc">核心词已自然融入</p></div><div><span class="badge green">✓ 已完成</span><h3 style="margin-top:9px">经历结果量化</h3><p class="page-desc">3 项结果已有数据</p></div><div><span class="badge yellow">需确认</span><h3 style="margin-top:9px">个人贡献边界</h3><p class="page-desc">4 处表述待人工确认</p></div><div><span class="badge yellow">需准备</span><h3 style="margin-top:9px">AI 项目证据</h3><p class="page-desc">建议携带 Demo 截图</p></div></div></section>
    <div class="export-grid">
      <section class="card export-option"><div class="export-icon">TXT</div><h2>复制最终简历</h2><p>复制纯文本版本，可直接粘贴到招聘平台或在线文档。</p><button class="btn primary" data-copy="resume">复制到剪贴板</button></section>
      <section class="card export-option"><div class="export-icon">DOC</div><h2>Word 文档</h2><p>保留标准简历结构与排版，适合继续调整和投递。</p><button class="btn" data-export="word">导出 Word</button></section>
      <section class="card export-option"><div class="export-icon">PDF</div><h2>PDF 文件</h2><p>使用浏览器打印功能生成 PDF，确保不同设备显示一致。</p><button class="btn" data-action="print">打印 / 保存 PDF</button></section>
    </div>
    <section class="card section" style="margin-top:16px"><div class="section-head"><div><h2>面试准备材料</h2><div class="section-kicker">包含 10 个问题、证据清单、风险提示与自我介绍</div></div><button class="btn" data-copy="interview">复制面试材料</button></div><div class="insight">建议在每次面试前，结合具体公司产品与 JD 再补充 3 个定制问题。当前版本重点覆盖 AI 转型岗位的经验迁移和可信度验证。</div></section>
    <section class="card section"><div class="section-head"><div><h2>最终简历预览</h2><div class="section-kicker">与“简历优化”中的终稿保持同步</div></div><button class="btn small" data-step="5">返回修改</button></div></section>${resumePaper()}`;
}

function emptyPage() {
  return `${pageHeader(state.currentStep, steps[state.currentStep].title, steps[state.currentStep].desc)}<div class="card empty-state"><div class="empty-icon">⌁</div><h2>请先完成材料分析</h2><p>填写目标岗位、JD 和原始简历后，Agent 会生成该步骤的完整结果。</p><button class="btn primary" data-step="0">返回输入材料</button></div>`;
}

function render() {
  const pages = [inputPage, jdPage, diagnosisPage, matchPage, questionsPage, optimizationPage, interviewPage, exportPage];
  const content = !state.analyzed && state.currentStep > 0 ? emptyPage() : pages[state.currentStep]();
  document.getElementById("app").innerHTML = appTemplate(content);
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-step]").forEach(el => el.addEventListener("click", () => goStep(Number(el.dataset.step))));
  document.querySelectorAll("[data-field]").forEach(el => el.addEventListener("input", event => {
    state.form[event.target.dataset.field] = event.target.value;
    if (event.target.dataset.field === "jd") document.getElementById("jd-count").textContent = event.target.value.length;
    if (event.target.dataset.field === "resume") document.getElementById("resume-count").textContent = event.target.value.length;
  }));
  document.querySelectorAll("[data-answer]").forEach(el => el.addEventListener("input", event => {
    const index = Number(event.target.dataset.answer);
    state.answers[index] = event.target.value;
    const btn = document.querySelector(`[data-generate="${index}"]`);
    if (btn) { btn.disabled = !event.target.value.trim(); btn.classList.toggle("primary", !!event.target.value.trim()); }
  }));
  document.querySelectorAll("[data-generate]").forEach(el => el.addEventListener("click", () => generateBullet(Number(el.dataset.generate))));
  document.querySelectorAll("[data-mode]").forEach(el => el.addEventListener("click", () => { state.mode = el.dataset.mode; render(); }));
  document.querySelectorAll("[data-interview]").forEach(el => el.addEventListener("click", () => {
    const i = Number(el.dataset.interview);
    state.openInterview.has(i) ? state.openInterview.delete(i) : state.openInterview.add(i);
    render();
  }));
  document.querySelectorAll("[data-copy]").forEach(el => el.addEventListener("click", () => copyByType(el.dataset.copy)));
  document.querySelectorAll("[data-export]").forEach(el => el.addEventListener("click", () => showDialog("Word 导出即将开放", "当前版本已提供排版预览和纯文本复制。你可以先复制最终简历到 Word；接入真实后端后可直接生成 .docx 文件。")));
  document.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", () => handleAction(el.dataset.action)));
}

function goStep(index) {
  if (!state.analyzed && index > 0) { toast("请先填写材料并开始分析"); return; }
  state.currentStep = index;
  state.visited.add(index);
  state.mobileNav = false;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleAction(action) {
  if (action === "sample") { state.form = { ...sampleForm }; render(); toast("示例数据已填入"); }
  if (action === "clear") { state.form = { role: "", industry: "", companyType: "", stage: "", strengths: "", jd: "", resume: "", extra: "" }; render(); }
  if (action === "analyze") startAnalysis();
  if (action === "toggle-nav") { state.mobileNav = !state.mobileNav; render(); }
  if (action === "help") showDialog("如何使用简历专家", "先输入目标 JD 和原始简历，再依次查看岗位解析、诊断与匹配结果。经历追问中的回答会同步进入最终简历。所有分析均为本地 mock，不会上传个人信息。" );
  if (action === "fill-answers") fillSampleAnswers();
  if (action === "expand-all") { state.openInterview = new Set(interviewQuestions.map((_, i) => i)); render(); }
  if (action === "print") window.print();
}

function startAnalysis() {
  if (!state.form.jd.trim() || !state.form.resume.trim()) { toast("请先填写目标 JD 和原始简历"); return; }
  state.analyzing = true;
  render();
  const texts = ["解析 JD 关键词与能力结构…", "识别简历中的岗位证据…", "计算匹配差距与修改优先级…", "生成定制优化策略…"];
  let i = 0;
  const timer = setInterval(() => {
    i += 1;
    const target = document.getElementById("loading-step");
    if (target && i < texts.length) target.textContent = texts[i];
  }, 430);
  setTimeout(() => {
    clearInterval(timer);
    state.analyzing = false;
    state.analyzed = true;
    state.currentStep = 1;
    state.visited.add(1);
    render();
    window.scrollTo({ top: 0 });
    toast("分析完成：已生成 8 个步骤的定制结果");
  }, 1850);
}

function fillSampleAnswers() {
  state.answers = [
    "我负责盘点模块需求和方案，和 2 位仓库主管做了现场走查。将纸质任务改为系统分配，并增加扫码复核。上线后单仓盘点从 2 天缩短到半天。",
    "采购和库存模块服务约 20 家制造业客户，月均采购单约 8 万条。我主要负责标准流程和 3 类行业差异的配置方案。",
    "我独立访谈了财务、采购和管理层 12 位用户，梳理并统一了 23 个指标口径，负责原型、需求评审和上线验收。",
    "用 Dify 接入约 300 份内部产品文档，整理 50 个高频问题做测试。首轮约 68% 可直接使用，主要问题是版本过期和跨文档召回遗漏。",
    "经营报表项目中业务要求两周上线，研发认为口径未确认。我拆成核心指标首期和扩展指标二期，先完成 12 个关键指标并建立口径评审机制。",
    "访谈 12 名一线仓管和主管，将 30 多条反馈归纳为效率、差错和追溯三类问题，最终将扫码复核列为最高优先级。",
    "报表当前日活约 300 人；月报制作从原来的 3 天人工汇总缩短到约 4 小时，管理层可按日查看库存和履约情况。"
  ];
  render();
  toast("示例回答已填入，可逐条生成优化表达");
}

function generateBullet(index) {
  const answer = state.answers[index].trim();
  if (!answer) return;
  const templates = [
    "主导 WMS 盘点流程升级，通过现场走查重构任务分配与扫码复核机制，将单仓盘点周期由 2 天缩短至 0.5 天。",
    "负责服务约 20 家制造企业的 ERP 采购与库存模块，支撑月均约 8 万条采购单，并将行业差异沉淀为可配置方案。",
    "独立访谈财务、采购与管理层 12 位用户，统一 23 个经营指标口径，推动经营报表从需求评审到上线验收。",
    "基于 Dify 搭建企业知识库 Demo，接入约 300 份内部文档并构建 50 题评测集，识别知识时效与跨文档召回等关键问题。",
    "面对交付周期与指标口径冲突，设计两期上线方案并建立口径评审机制，首期按时交付 12 个核心指标。",
    "访谈 12 名仓储用户，将 30 余条反馈归纳为效率、差错与追溯三类问题，据此确定扫码复核功能优先级。",
    "推动经营报表覆盖约 300 名日活用户，将月报人工汇总时间由 3 天缩短至约 4 小时。"
  ];
  state.bullets[index] = templates[index];
  render();
  toast("已生成简历 bullet，并同步到最终简历");
}

function resumeText() {
  const el = document.getElementById("final-resume");
  if (el) return el.innerText.replace(/\n{3,}/g, "\n\n");
  const holder = document.createElement("div");
  holder.innerHTML = resumePaper();
  return holder.innerText.replace(/\n{3,}/g, "\n\n");
}

function interviewText() {
  return `面试准备｜${state.form.role || "AI 产品经理"}\n\n高概率问题\n${interviewQuestions.map((q,i)=>`${i+1}. ${q[1]}\n准备要点：${q[2]}`).join("\n\n")}\n\n需要准备的证据\n- 知识库 Demo 的产品流程、配置和失败案例\n- WMS 盘点改造前后流程与数据口径\n- 经营报表指标清单与角色差异\n- 跨部门冲突的完整复盘`;
}

async function copyByType(type) {
  let text = "";
  if (type === "resume") text = resumeText();
  if (type === "summary") text = document.getElementById("summary-text")?.innerText || "";
  if (type === "intro") text = document.getElementById("intro-text")?.innerText || "";
  if (type === "interview") text = interviewText();
  try {
    await navigator.clipboard.writeText(text);
    toast("已复制到剪贴板");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    toast("已复制到剪贴板");
  }
}

function showDialog(title, message) {
  document.getElementById("dialog-root").innerHTML = `<div class="dialog-backdrop" role="presentation" data-dialog-close><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h2 id="dialog-title">${title}</h2><p>${message}</p><div class="dialog-actions"><button class="btn primary" data-dialog-close>知道了</button></div></div></div>`;
  document.querySelectorAll("[data-dialog-close]").forEach(el => el.addEventListener("click", event => {
    if (event.target === el || el.tagName === "BUTTON") document.getElementById("dialog-root").innerHTML = "";
  }));
}

let toastTimer;
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

render();
