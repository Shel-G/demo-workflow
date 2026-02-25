import React, { useState } from "react";

const COLORS = {
  b: "#0F172A",       // background
  card: "#1E293B",    // card bg
  border: "#334155",  // border
  blue: "#38BDF8",    // primary accent
  teal: "#2DD4BF",    // secondary
  orange: "#FB923C",  // B端
  purple: "#A78BFA",  // AI/data
  green: "#4ADE80",   // C端
  muted: "#64748B",
  text: "#E2E8F0",
  dim: "#94A3B8",
};

const phases = [
  {
    id: "input",
    step: "Step 1",
    label: "商家输入",
    color: COLORS.orange,
    icon: "⬆",
    layer: "B端 · B1 + B2",
    nodes: [
      { id: "register", label: "注册/登录", sub: "邮箱/手机验证码", tag: "B1" },
      { id: "shopinfo", label: "创建店铺", sub: "店名 · Logo · 营业时间", tag: "B1" },
      { id: "upload", label: "上传菜单", sub: "图片1-3张 / PDF / Excel", tag: "B2", highlight: true },
      { id: "desc", label: "填写店铺描述", sub: "「网红日式 · 午市定食 · 高颜值风格」", tag: "B2" },
    ]
  },
  {
    id: "parse",
    step: "Step 2",
    label: "AI解析",
    color: COLORS.purple,
    icon: "⚙",
    layer: "AI中台 · A1",
    nodes: [
      { id: "ocr", label: "OCR + 多模态LLM", sub: "提取分类/菜名/价格/描述", tag: "A1", highlight: true },
      { id: "confirm", label: "人工确认页", sub: "改字/改价/拖拽换分类/增删菜品", tag: "B2" },
      { id: "nlp", label: "NLP风格意图提取", sub: "日式 · 简约 · 高颜值 → 标签", tag: "A1" },
      { id: "schema", label: "输出标准Schema", sub: "分类/菜品/价格/描述/标签 → DB", tag: "A1" },
    ]
  },
  {
    id: "match",
    step: "Step 3",
    label: "模板匹配",
    color: COLORS.blue,
    icon: "◈",
    layer: "AI中台 + B端 · B4",
    nodes: [
      { id: "match1", label: "风格标签检索模板库", sub: "日式/简约/暖色系...匹配", tag: "模板库" },
      { id: "candidates", label: "给出3个候选主题", sub: "商家手机视角预览选择", tag: "B4", highlight: true },
    ]
  },
  {
    id: "generate",
    step: "Step 4",
    label: "SDUI配置生成",
    color: COLORS.purple,
    icon: "✦",
    layer: "AI中台 · 核心生成",
    nodes: [
      { id: "llmgen", label: "LLM生成SDUI配置JSON", sub: "模板Schema + 菜单数据 + 商家描述", tag: "A1", highlight: true },
      { id: "jsonout", label: "输出配置内容", sub: "页面模块 · 布局参数 · 颜色字体 · 内容填充", tag: "JSON" },
      { id: "rag_build", label: "构建RAG知识库", sub: "店铺FAQ + 菜品向量化 → 向量库", tag: "A2" },
      { id: "i18n", label: "LLM批量翻译 (中→英)", sub: "逐条校对界面 · 长尾语种实时翻译", tag: "B3" },
    ]
  },
  {
    id: "render",
    step: "Step 5",
    label: "渲染发布",
    color: COLORS.teal,
    icon: "▶",
    layer: "B端 · B4 + SDUI引擎",
    nodes: [
      { id: "preview", label: "B端预览", sub: "手机视角实时预览B+C端页面", tag: "B4", highlight: true },
      { id: "publish", label: "一键发布", sub: "生成可访问链接 · 下载二维码PNG", tag: "B4" },
    ]
  },
  {
    id: "customer",
    step: "C端",
    label: "顾客点单",
    color: COLORS.green,
    icon: "☺",
    layer: "C端 · C1–C4",
    nodes: [
      { id: "enter", label: "扫码进入H5", sub: "读取浏览器语言 → 自动本地化UI", tag: "C1" },
      { id: "browse", label: "菜单浏览", sub: "分类列表 → 商品卡片 → 详情页", tag: "C2" },
      { id: "ai_agent", label: "AI伴随Agent", sub: "问候 · 推荐 · Q&A · 关联推荐按钮", tag: "C3", highlight: true },
      { id: "cart", label: "加购 → 结算 → 下单", sub: "购物车 · 数量调整 · 订单生成", tag: "C4" },
      { id: "payment", label: "支付 (mock)", sub: "模拟支付页 → 订单完成页", tag: "C4" },
    ]
  },
  {
    id: "data",
    step: "Step 6",
    label: "数据回流 + 微调",
    color: COLORS.orange,
    icon: "↺",
    layer: "AI中台 · A3 + B端微调",
    nodes: [
      { id: "notify", label: "B端收到订单提醒", sub: "WebSocket推送 · 订单看板", tag: "A3" },
      { id: "analytics", label: "会话与行为回流", sub: "会话内容 · 点击推荐 · 下单商品", tag: "A3" },
      { id: "finetune", label: "商家聊天微调", sub: "「主色调换暗红」→ LLM更新SDUI JSON", tag: "B2", highlight: true },
    ]
  }
];

const agentFlow = [
  { phase: "进入首页", behavior: "主动问候", detail: "「欢迎光临！需要帮您推荐今日招牌吗？」", icon: "👋" },
  { phase: "浏览列表", behavior: "智能问答", detail: "招牌推荐 / 不辣选项 / 素食菜品", icon: "🔍" },
  { phase: "商品详情", behavior: "深度Q&A", detail: "做法 / 过敏原 / 口味描述 + 关联推荐", icon: "💬" },
  { phase: "下单前", behavior: "RAG优先", detail: "优先引用店铺FAQ+菜品信息，再生成", icon: "📚" },
];

const dataSchema = {
  title: "标准菜单 Schema（A1输出）",
  fields: [
    { name: "category", type: "string", desc: "菜品分类" },
    { name: "name", type: "string", desc: "菜品名称（中/英）" },
    { name: "price", type: "number", desc: "价格" },
    { name: "description", type: "string?", desc: "简短描述（可AI补全）" },
    { name: "tags", type: "string[]", desc: "辣度/素食/招牌/过敏原" },
    { name: "imageUrl", type: "string?", desc: "菜品图片" },
  ]
};

export default function WorkflowDiagram() {
  const [activePhase, setActivePhase] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [tab, setTab] = useState("flow"); // flow | agent | schema

  const active = phases.find(p => p.id === activePhase);

  return (
    <div style={{
      background: COLORS.b,
      minHeight: "100vh",
      color: COLORS.text,
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ color: COLORS.teal, fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Demo v1.0</span>
          <span style={{ color: COLORS.muted, fontSize: 11 }}>·</span>
          <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 2 }}>餐饮SaaS 工作流</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, color: COLORS.text }}>
          端到端工作流 · 功能对照图
        </h1>
        <p style={{ color: COLORS.dim, fontSize: 13, margin: "0 0 28px" }}>
          B端生成菜单 → 发布 → C端点单 → AI问答推荐 → 下单 → 数据回流
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {[["flow", "工作流总图"], ["agent", "AI Agent行为"], ["schema", "数据Schema"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "7px 16px", borderRadius: 6, border: "1px solid",
              borderColor: tab === key ? COLORS.teal : COLORS.border,
              background: tab === key ? "rgba(45,212,191,0.12)" : "transparent",
              color: tab === key ? COLORS.teal : COLORS.dim,
              fontSize: 12, cursor: "pointer", letterSpacing: 0.5,
              transition: "all 0.15s"
            }}>{label}</button>
          ))}
        </div>

        {/* ========= TAB: FLOW ========= */}
        {tab === "flow" && (
          <div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { color: COLORS.orange, label: "B端商家" },
                { color: COLORS.purple, label: "AI中台" },
                { color: COLORS.teal, label: "渲染/发布" },
                { color: COLORS.green, label: "C端顾客" },
                { color: COLORS.blue, label: "模板匹配" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 11, color: COLORS.dim }}>{label}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, border: "1.5px solid #FB923C", background: "rgba(251,146,60,0.15)" }} />
                <span style={{ fontSize: 11, color: COLORS.dim }}>核心节点</span>
              </div>
            </div>

            {/* Phase cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {phases.map((phase, pi) => (
                <div key={phase.id}>
                  {/* Phase Row */}
                  <div
                    onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr",
                      gap: 0,
                      cursor: "pointer",
                      borderRadius: activePhase === phase.id ? "8px 8px 0 0" : 8,
                      border: `1px solid ${activePhase === phase.id ? phase.color : COLORS.border}`,
                      overflow: "hidden",
                      transition: "all 0.2s",
                      marginBottom: activePhase === phase.id ? 0 : 8,
                    }}
                  >
                    {/* Step label */}
                    <div style={{
                      background: activePhase === phase.id ? phase.color : `${phase.color}22`,
                      padding: "16px 12px",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                      transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 20 }}>{phase.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: activePhase === phase.id ? COLORS.b : phase.color, letterSpacing: 1 }}>{phase.step}</span>
                      <span style={{ fontSize: 10, color: activePhase === phase.id ? `${COLORS.b}bb` : COLORS.muted, textAlign: "center" }}>{phase.label}</span>
                    </div>

                    {/* Nodes preview */}
                    <div style={{
                      background: COLORS.card,
                      padding: "14px 16px",
                      display: "flex", flexDirection: "column", justifyContent: "center", gap: 8,
                    }}>
                      <div style={{ fontSize: 10, color: phase.color, letterSpacing: 2, marginBottom: 2 }}>{phase.layer}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {phase.nodes.map(node => (
                          <div key={node.id} style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "3px 10px", borderRadius: 4,
                            background: node.highlight ? `${phase.color}22` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${node.highlight ? phase.color : COLORS.border}`,
                          }}>
                            <span style={{ fontSize: 12, color: node.highlight ? phase.color : COLORS.text }}>{node.label}</span>
                            <span style={{ fontSize: 10, color: COLORS.muted, background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 3 }}>{node.tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {activePhase === phase.id && (
                    <div style={{
                      border: `1px solid ${phase.color}`,
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      background: `${phase.color}08`,
                      marginBottom: 8,
                      overflow: "hidden",
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, padding: 1 }}>
                        {phase.nodes.map(node => (
                          <div key={node.id} style={{
                            background: node.highlight ? `${phase.color}18` : COLORS.card,
                            padding: "16px 18px",
                            cursor: "pointer",
                            borderLeft: node.highlight ? `3px solid ${phase.color}` : "3px solid transparent",
                            transition: "all 0.15s",
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = `${phase.color}20`}
                            onMouseLeave={e => e.currentTarget.style.background = node.highlight ? `${phase.color}18` : COLORS.card}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: node.highlight ? phase.color : COLORS.text }}>{node.label}</span>
                              <span style={{ fontSize: 10, color: phase.color, background: `${phase.color}20`, padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 8 }}>{node.tag}</span>
                            </div>
                            <span style={{ fontSize: 11, color: COLORS.dim, lineHeight: 1.6 }}>{node.sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Arrow connector */}
                  {pi < phases.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", margin: "-2px 0", position: "relative", zIndex: 1 }}>
                      <div style={{ width: 2, height: 16, background: `linear-gradient(${phase.color}, ${phases[pi+1].color})` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Loop indicator */}
            <div style={{
              marginTop: 16,
              padding: "12px 20px",
              borderRadius: 8,
              border: `1px dashed ${COLORS.teal}`,
              background: "rgba(45,212,191,0.05)",
              fontSize: 12,
              color: COLORS.teal,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>↺</span>
              <span>Step 6 微调 → 触发 Step 4 重新生成SDUI配置JSON → Step 5 即时更新预览（无需重新发布）</span>
            </div>
          </div>
        )}

        {/* ========= TAB: AGENT ========= */}
        {tab === "agent" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: COLORS.teal, letterSpacing: 2, marginBottom: 8 }}>C3 · 单一AI伴随Agent · 文字+（可选麦克风）</div>
              <div style={{ fontSize: 12, color: COLORS.dim }}>Agent在C端全程伴随，根据顾客所在页面上下文切换行为；优先从RAG知识库（店铺FAQ+菜品向量）引用，再做生成</div>
            </div>

            {/* Agent behavior flow */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {agentFlow.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 0, position: "relative" }}>
                  {/* Line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `rgba(167,139,250,0.2)`,
                      border: `2px solid ${COLORS.purple}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, flexShrink: 0
                    }}>{item.icon}</div>
                    {i < agentFlow.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 20, background: `${COLORS.purple}44`, margin: "4px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < agentFlow.length - 1 ? 20 : 0, paddingLeft: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple }}>{item.phase}</span>
                      <span style={{ fontSize: 11, background: `${COLORS.purple}22`, color: COLORS.purple, padding: "2px 8px", borderRadius: 4 }}>{item.behavior}</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.dim, lineHeight: 1.7, background: COLORS.card, padding: "10px 14px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RAG detail */}
            <div style={{
              marginTop: 24,
              padding: "18px 20px",
              borderRadius: 8,
              border: `1px solid ${COLORS.purple}`,
              background: `${COLORS.purple}10`,
            }}>
              <div style={{ fontSize: 11, color: COLORS.purple, letterSpacing: 2, marginBottom: 12 }}>A2 · RAG知识库架构</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { title: "知识源", items: ["菜品名/描述/标签", "店铺故事/FAQ（文字录入）", "价格/分类信息"] },
                  { title: "检索方式", items: ["MVP可用全文检索+Top-k", "后续升级向量库（轻量方案）", "Agent优先引用，不足时生成"] },
                  { title: "Agent回答优先级", items: ["1. 店铺FAQ/政策（最优先）", "2. 菜品详情页信息", "3. LLM生成补充（兜底）"] },
                ].map(col => (
                  <div key={col.title}>
                    <div style={{ fontSize: 11, color: COLORS.teal, marginBottom: 8 }}>{col.title}</div>
                    {col.items.map(item => (
                      <div key={item} style={{ fontSize: 11, color: COLORS.dim, padding: "4px 0", borderBottom: `1px solid ${COLORS.border}` }}>{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========= TAB: SCHEMA ========= */}
        {tab === "schema" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: COLORS.teal, letterSpacing: 2, marginBottom: 6 }}>A1 · 标准数据Schema</div>
              <div style={{ fontSize: 12, color: COLORS.dim }}>OCR+LLM提取后输出统一格式，允许商家在B端人工修正后保存为最终版本</div>
            </div>

            {/* Menu schema */}
            <div style={{ background: COLORS.card, borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: COLORS.teal }}>MenuItem Schema</span>
                <span style={{ fontSize: 10, color: COLORS.muted }}>A1 输出 · B端可编辑 · C端渲染消费</span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                {dataSchema.fields.map((f, i) => (
                  <div key={f.name} style={{
                    display: "grid", gridTemplateColumns: "160px 100px 1fr",
                    padding: "10px 0",
                    borderBottom: i < dataSchema.fields.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: COLORS.purple }}>{f.type}</span>
                    <span style={{ fontSize: 11, color: COLORS.dim }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SDUI config schema */}
            <div style={{ background: COLORS.card, borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 12, color: COLORS.teal }}>SDUI 配置 JSON 结构（Step 4 生成）</span>
              </div>
              <pre style={{ margin: 0, padding: "16px 18px", fontSize: 11, color: COLORS.dim, lineHeight: 1.8, overflowX: "auto" }}>{`{
  "themeId": "japanese-minimal-v2",
  "colors": {
    "primary": "#2D2D2D",
    "accent": "#C8A96E",
    "background": "#FAF8F4"
  },
  "typography": { "display": "Noto Serif JP", "body": "Inter" },
  "modules": [
    { "type": "HeroBanner", "props": { "title": "桜花定食", "tagline": "午市限定 · 精致日料", "backgroundImage": "..." } },
    { "type": "CategoryNav", "props": { "sticky": true } },
    { "type": "MenuGrid", "props": { "layout": "card", "showDescription": true } },
    { "type": "AIChat", "props": { "defaultOpen": false, "greeting": "欢迎光临！" } }
  ]
}`}</pre>
            </div>

            {/* Order schema */}
            <div style={{ background: COLORS.card, borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 12, color: COLORS.teal }}>Order Schema（A3 回流）</span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                {[
                  { name: "orderId", type: "string", desc: "唯一订单号" },
                  { name: "shopId", type: "string", desc: "店铺ID（多租户隔离）" },
                  { name: "items", type: "OrderItem[]", desc: "菜品 · 数量 · 单价" },
                  { name: "totalAmount", type: "number", desc: "合计金额" },
                  { name: "status", type: "enum", desc: "pending / paid / completed" },
                  { name: "sessionLog", type: "object?", desc: "会话内容 · 触发页面 · 点击推荐" },
                ].map((f, i) => (
                  <div key={f.name} style={{
                    display: "grid", gridTemplateColumns: "160px 100px 1fr",
                    padding: "10px 0",
                    borderBottom: i < 5 ? `1px solid ${COLORS.border}` : "none",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 600 }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: COLORS.purple }}>{f.type}</span>
                    <span style={{ fontSize: 11, color: COLORS.dim }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.muted }}>Demo Scope · B端B1-B4 · C端C1-C4 · AI中台A1-A3</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[["P0", COLORS.green], ["核心链路已覆盖", COLORS.dim]].map(([t, c]) => (
              <span key={t} style={{ fontSize: 10, color: c }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
