import React, { useState } from "react";

const C = {
  bg:          "#F5F7FA",
  surface:     "#FFFFFF",
  surfaceAlt:  "#F0F4F8",
  border:      "#DDE3EC",
  blue:        "#1D6FA4",
  blueLight:   "#EBF4FB",
  teal:        "#0E7F74",
  tealLight:   "#E6F6F4",
  orange:      "#C2520A",
  orangeLight: "#FEF0E7",
  purple:      "#6B3FA0",
  purpleLight: "#F2EDF9",
  green:       "#1A7A3C",
  greenLight:  "#E8F7EE",
  text:        "#111827",
  textSub:     "#374151",
  textMuted:   "#6B7280",
  textDim:     "#9CA3AF",
  white:       "#FFFFFF",
};

const phases = [
  {
    id: "input", step: "Step 1", label: "商家输入",
    color: C.orange, light: C.orangeLight, icon: "⬆",
    layer: "B端 · B1 + B2",
    nodes: [
      { id: "register", label: "注册 / 登录",   sub: "邮箱 · 手机验证码",                   tag: "B1" },
      { id: "shopinfo", label: "创建店铺",       sub: "店名 · Logo · 营业时间",              tag: "B1" },
      { id: "upload",   label: "上传菜单",       sub: "图片 1–3 张 / PDF / Excel",           tag: "B2", highlight: true },
      { id: "desc",     label: "填写店铺描述",   sub: "「网红日式 · 午市定食 · 高颜值风格」",  tag: "B2" },
    ],
  },
  {
    id: "parse", step: "Step 2", label: "AI 解析",
    color: C.purple, light: C.purpleLight, icon: "⚙",
    layer: "AI 中台 · A1",
    nodes: [
      { id: "ocr",     label: "OCR + 多模态 LLM",  sub: "提取分类 / 菜名 / 价格 / 描述",           tag: "A1", highlight: true },
      { id: "confirm", label: "人工确认页",          sub: "改字 · 改价 · 拖拽换分类 · 增删菜品",     tag: "B2" },
      { id: "nlp",     label: "NLP 风格意图提取",    sub: "日式 · 简约 · 高颜值 → 标签",             tag: "A1" },
      { id: "schema",  label: "输出标准 Schema",     sub: "分类 / 菜品 / 价格 / 描述 / 标签 → DB",   tag: "A1" },
    ],
  },
  {
    id: "match", step: "Step 3", label: "模板匹配",
    color: C.blue, light: C.blueLight, icon: "◈",
    layer: "AI 中台 + B端 · B4",
    nodes: [
      { id: "match1",     label: "风格标签检索模板库", sub: "日式 / 简约 / 暖色系… 匹配",  tag: "模板库" },
      { id: "candidates", label: "给出 3 个候选主题",  sub: "商家手机视角预览选择",          tag: "B4", highlight: true },
    ],
  },
  {
    id: "generate", step: "Step 4", label: "SDUI 配置生成",
    color: C.purple, light: C.purpleLight, icon: "✦",
    layer: "AI 中台 · 核心生成",
    nodes: [
      { id: "llmgen",    label: "LLM 生成 SDUI 配置 JSON",  sub: "模板 Schema + 菜单数据 + 商家描述",    tag: "A1", highlight: true },
      { id: "jsonout",   label: "输出配置内容",               sub: "页面模块 · 布局参数 · 颜色字体 · 内容填充", tag: "JSON" },
      { id: "rag_build", label: "构建 RAG 知识库",           sub: "店铺 FAQ + 菜品向量化 → 向量库",       tag: "A2" },
      { id: "i18n",      label: "LLM 批量翻译（中 → 英）",   sub: "逐条校对界面 · 长尾语种实时翻译",     tag: "B3" },
    ],
  },
  {
    id: "render", step: "Step 5", label: "渲染发布",
    color: C.teal, light: C.tealLight, icon: "▶",
    layer: "B端 · B4 + SDUI 引擎",
    nodes: [
      { id: "preview", label: "B 端预览", sub: "手机视角实时预览 B + C 端页面", tag: "B4", highlight: true },
      { id: "publish", label: "一键发布", sub: "生成可访问链接 · 下载二维码 PNG", tag: "B4" },
    ],
  },
  {
    id: "customer", step: "C端", label: "顾客点单",
    color: C.green, light: C.greenLight, icon: "☺",
    layer: "C端 · C1–C4",
    nodes: [
      { id: "enter",    label: "扫码进入 H5",      sub: "读取浏览器语言 → 自动本地化 UI",         tag: "C1" },
      { id: "browse",   label: "菜单浏览",          sub: "分类列表 → 商品卡片 → 详情页",          tag: "C2" },
      { id: "ai_agent", label: "AI 伴随 Agent",     sub: "问候 · 推荐 · Q&A · 关联推荐按钮",      tag: "C3", highlight: true },
      { id: "cart",     label: "加购 → 结算 → 下单", sub: "购物车 · 数量调整 · 订单生成",          tag: "C4" },
      { id: "payment",  label: "支付（mock）",       sub: "模拟支付页 → 订单完成页",               tag: "C4" },
    ],
  },
  {
    id: "data", step: "Step 6", label: "数据回流 + 微调",
    color: C.orange, light: C.orangeLight, icon: "↺",
    layer: "AI 中台 · A3 + B端微调",
    nodes: [
      { id: "notify",    label: "B 端收到订单提醒", sub: "WebSocket 推送 · 订单看板",               tag: "A3" },
      { id: "analytics", label: "会话与行为回流",   sub: "会话内容 · 点击推荐 · 下单商品",          tag: "A3" },
      { id: "finetune",  label: "商家聊天微调",     sub: "「主色调换暗红」→ LLM 更新 SDUI JSON",    tag: "B2", highlight: true },
    ],
  },
];

const agentFlow = [
  { phase: "进入首页", behavior: "主动问候",  detail: "「欢迎光临！需要帮您推荐今日招牌吗？」",         icon: "👋" },
  { phase: "浏览列表", behavior: "智能问答",  detail: "招牌推荐 / 不辣选项 / 素食菜品",                icon: "🔍" },
  { phase: "商品详情", behavior: "深度 Q&A", detail: "做法 / 过敏原 / 口味描述 + 关联推荐",           icon: "💬" },
  { phase: "下单前",   behavior: "RAG 优先", detail: "优先引用店铺 FAQ + 菜品信息，再做 LLM 生成补充", icon: "📚" },
];

const menuSchemaFields = [
  { name: "category",    type: "string",   desc: "菜品分类" },
  { name: "name",        type: "string",   desc: "菜品名称（中 / 英）" },
  { name: "price",       type: "number",   desc: "价格" },
  { name: "description", type: "string?",  desc: "简短描述（可 AI 补全）" },
  { name: "tags",        type: "string[]", desc: "辣度 / 素食 / 招牌 / 过敏原" },
  { name: "imageUrl",    type: "string?",  desc: "菜品图片" },
];

const orderSchemaFields = [
  { name: "orderId",     type: "string",      desc: "唯一订单号" },
  { name: "shopId",      type: "string",      desc: "店铺 ID（多租户隔离）" },
  { name: "items",       type: "OrderItem[]", desc: "菜品 · 数量 · 单价" },
  { name: "totalAmount", type: "number",      desc: "合计金额" },
  { name: "status",      type: "enum",        desc: "pending / paid / completed" },
  { name: "sessionLog",  type: "object?",     desc: "会话内容 · 触发页面 · 点击推荐" },
];

function TagBadge({ text, color }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
      background: color + "18", color, border: "1px solid " + color + "33",
      whiteSpace: "nowrap", lineHeight: 1,
    }}>{text}</span>
  );
}

function SectionLabel({ text, color }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color, marginBottom: 10,
    }}>{text}</div>
  );
}

function SchemaCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 10,
      border: "1px solid " + C.border, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{
        padding: "12px 18px", borderBottom: "1px solid " + C.border,
        background: C.surfaceAlt,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</span>
        <span style={{ fontSize: 11, color: C.textMuted }}>{subtitle}</span>
      </div>
      <div style={{ padding: "4px 18px 8px" }}>{children}</div>
    </div>
  );
}

function SchemaRow({ f, last, nameColor }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "160px 110px 1fr",
      padding: "10px 0", alignItems: "center",
      borderBottom: last ? "none" : "1px solid " + C.border,
    }}>
      <span style={{
        fontSize: 13, fontWeight: 700, color: nameColor,
        fontFamily: "'Fira Code','Courier New',monospace",
      }}>{f.name}</span>
      <span style={{
        fontSize: 12, color: C.purple,
        fontFamily: "'Fira Code','Courier New',monospace",
      }}>{f.type}</span>
      <span style={{ fontSize: 13, color: C.textSub }}>{f.desc}</span>
    </div>
  );
}

export default function WorkflowDiagram() {
  const [activePhase, setActivePhase] = useState(null);
  const [tab, setTab] = useState("flow");

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", color: C.text,
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      padding: "40px 24px 60px",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: C.white,
              background: C.teal, padding: "3px 10px", borderRadius: 4,
            }}>Demo v1.0</span>
            <span style={{ fontSize: 13, color: C.textMuted }}>餐饮 SaaS 工作流</span>
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: "0 0 8px",
            letterSpacing: -0.5, color: C.text, lineHeight: 1.2,
          }}>端到端工作流 · 功能对照图</h1>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            B 端生成菜单 → 发布 → C 端点单 → AI 问答推荐 → 下单 → 数据回流
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 28,
          borderBottom: "2px solid " + C.border,
        }}>
          {[["flow","工作流总图"],["agent","AI Agent 行为"],["schema","数据 Schema"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "9px 20px", border: "none", background: "none",
              fontSize: 13, fontWeight: tab === key ? 700 : 500,
              cursor: "pointer",
              color: tab === key ? C.teal : C.textMuted,
              borderBottom: "2px solid " + (tab === key ? C.teal : "transparent"),
              marginBottom: -2, transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        {/* ── TAB: FLOW ── */}
        {tab === "flow" && (
          <div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { color: C.orange, label: "B端商家" },
                { color: C.purple, label: "AI 中台" },
                { color: C.teal,   label: "渲染发布" },
                { color: C.green,  label: "C端顾客" },
                { color: C.blue,   label: "模板匹配" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Phases */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {phases.map((phase, pi) => (
                <div key={phase.id}>
                  {/* Phase row */}
                  <div
                    onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                    style={{
                      display: "grid", gridTemplateColumns: "108px 1fr",
                      cursor: "pointer",
                      borderRadius: activePhase === phase.id ? "10px 10px 0 0" : 10,
                      border: "1.5px solid " + (activePhase === phase.id ? phase.color : C.border),
                      overflow: "hidden",
                      boxShadow: activePhase === phase.id
                        ? "0 0 0 3px " + phase.color + "18"
                        : "0 1px 3px rgba(0,0,0,0.05)",
                      transition: "all 0.18s",
                      marginBottom: activePhase === phase.id ? 0 : 6,
                      background: C.surface,
                    }}
                  >
                    <div style={{
                      background: activePhase === phase.id ? phase.color : phase.light,
                      padding: "16px 10px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 4,
                      transition: "all 0.18s",
                    }}>
                      <span style={{ fontSize: 18 }}>{phase.icon}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
                        color: activePhase === phase.id ? C.white : phase.color,
                      }}>{phase.step}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, textAlign: "center",
                        color: activePhase === phase.id ? C.white + "bb" : C.textMuted,
                      }}>{phase.label}</span>
                    </div>

                    <div style={{
                      padding: "14px 16px",
                      display: "flex", flexDirection: "column",
                      justifyContent: "center", gap: 8,
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: phase.color,
                      }}>{phase.layer}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {phase.nodes.map(node => (
                          <div key={node.id} style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "4px 10px", borderRadius: 6,
                            background: node.highlight ? phase.light : C.surfaceAlt,
                            border: "1px solid " + (node.highlight ? phase.color : C.border),
                          }}>
                            <span style={{
                              fontSize: 12,
                              fontWeight: node.highlight ? 600 : 400,
                              color: node.highlight ? phase.color : C.textSub,
                            }}>{node.label}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 600, color: C.textMuted,
                              background: C.border, padding: "1px 5px", borderRadius: 3,
                            }}>{node.tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {activePhase === phase.id && (
                    <div style={{
                      border: "1.5px solid " + phase.color,
                      borderTop: "1px solid " + phase.color + "44",
                      borderRadius: "0 0 10px 10px",
                      marginBottom: 6, overflow: "hidden",
                      boxShadow: "0 0 0 3px " + phase.color + "18",
                    }}>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 1, background: C.border,
                      }}>
                        {phase.nodes.map(node => (
                          <div key={node.id} style={{
                            background: node.highlight ? phase.light : C.surface,
                            padding: "16px 18px",
                            borderLeft: "3px solid " + (node.highlight ? phase.color : "transparent"),
                          }}>
                            <div style={{
                              display: "flex", justifyContent: "space-between",
                              alignItems: "flex-start", marginBottom: 6, gap: 8,
                            }}>
                              <span style={{
                                fontSize: 13, fontWeight: 700, lineHeight: 1.3,
                                color: node.highlight ? phase.color : C.text,
                              }}>{node.label}</span>
                              <TagBadge text={node.tag} color={phase.color} />
                            </div>
                            <p style={{
                              fontSize: 12, color: C.textMuted,
                              lineHeight: 1.65, margin: 0,
                            }}>{node.sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Arrow */}
                  {pi < phases.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center",
                      margin: "-1px 0", position: "relative", zIndex: 1 }}>
                      <div style={{
                        width: 2, height: 14,
                        background: "linear-gradient(" + phase.color + "88," + phases[pi+1].color + "88)",
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Loop note */}
            <div style={{
              marginTop: 20, padding: "14px 20px", borderRadius: 10,
              border: "1.5px dashed " + C.teal,
              background: C.tealLight,
              fontSize: 13, color: C.teal,
              display: "flex", alignItems: "flex-start", gap: 10,
              lineHeight: 1.6,
            }}>
              <span style={{ fontSize: 18, lineHeight: 1.4 }}>↺</span>
              <span>
                <strong>微调循环：</strong>
                Step 6 商家对话微调 → 触发 Step 4 重新生成 SDUI 配置 JSON → Step 5 即时更新预览，无需重新发布
              </span>
            </div>
          </div>
        )}

        {/* ── TAB: AGENT ── */}
        {tab === "agent" && (
          <div>
            <div style={{
              marginBottom: 24, padding: "16px 20px",
              background: C.purpleLight, borderRadius: 10,
              border: "1px solid " + C.purple + "33",
            }}>
              <SectionLabel text="C3 · 单一 AI 伴随 Agent · 文字 + 可选麦克风" color={C.purple} />
              <p style={{ fontSize: 13, color: C.textSub, margin: 0, lineHeight: 1.7 }}>
                Agent 在 C 端全程伴随，根据顾客所在页面上下文自动切换行为。
                优先从 RAG 知识库（店铺 FAQ + 菜品向量）检索引用，再做 LLM 生成补充。
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
              {agentFlow.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: C.purpleLight, border: "2px solid " + C.purple,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                      boxShadow: "0 0 0 3px " + C.purple + "18",
                    }}>{item.icon}</div>
                    {i < agentFlow.length - 1 && (
                      <div style={{
                        width: 2, flex: 1, minHeight: 24,
                        background: C.purple + "30", margin: "4px 0",
                      }} />
                    )}
                  </div>
                  <div style={{
                    paddingBottom: i < agentFlow.length - 1 ? 20 : 0,
                    paddingLeft: 14,
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.phase}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 9px",
                        borderRadius: 5, background: C.purpleLight, color: C.purple,
                        border: "1px solid " + C.purple + "33",
                      }}>{item.behavior}</span>
                    </div>
                    <div style={{
                      fontSize: 13, color: C.textSub, lineHeight: 1.7,
                      background: C.surface, padding: "12px 16px",
                      borderRadius: 8, border: "1px solid " + C.border,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: "20px 22px", borderRadius: 10,
              border: "1.5px solid " + C.purple + "44",
              background: C.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <SectionLabel text="A2 · RAG 知识库架构" color={C.purple} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {[
                  { title: "知识源",      color: C.blue,   items: ["菜品名 / 描述 / 标签","店铺故事 / FAQ（文字录入）","价格 / 分类信息"] },
                  { title: "检索方式",    color: C.teal,   items: ["MVP 可用全文检索 + Top-k","后续升级向量库（轻量方案）","Agent 优先引用，不足时生成"] },
                  { title: "回答优先级",  color: C.orange, items: ["① 店铺 FAQ / 政策","② 菜品详情页信息","③ LLM 生成补充（兜底）"] },
                ].map(col => (
                  <div key={col.title}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.color, marginBottom: 10 }}>{col.title}</div>
                    {col.items.map((item, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: C.textSub, padding: "7px 0", lineHeight: 1.5,
                        borderBottom: i < col.items.length - 1 ? "1px solid " + C.border : "none",
                      }}>{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SCHEMA ── */}
        {tab === "schema" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              padding: "14px 18px", background: C.tealLight,
              borderRadius: 10, border: "1px solid " + C.teal + "33",
            }}>
              <SectionLabel text="A1 · 标准数据 Schema" color={C.teal} />
              <p style={{ fontSize: 13, color: C.textSub, margin: 0, lineHeight: 1.6 }}>
                OCR + LLM 提取后输出统一格式，允许商家在 B 端人工修正后保存为最终版本
              </p>
            </div>

            <SchemaCard title="MenuItem Schema" subtitle="A1 输出 · B端可编辑 · C端渲染消费">
              {menuSchemaFields.map((f, i) => (
                <SchemaRow key={f.name} f={f} last={i === menuSchemaFields.length - 1} nameColor={C.blue} />
              ))}
            </SchemaCard>

            <div style={{
              background: C.surface, borderRadius: 10,
              border: "1px solid " + C.border, overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "12px 18px", borderBottom: "1px solid " + C.border,
                background: C.surfaceAlt,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>SDUI 配置 JSON 结构</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>Step 4 生成</span>
              </div>
              <pre style={{
                margin: 0, padding: "18px 20px",
                fontSize: 12, color: C.textSub,
                lineHeight: 1.9, overflowX: "auto", background: "#F9FAFB",
                fontFamily: "'Fira Code','Courier New',monospace",
              }}>{`{
  "themeId": "japanese-minimal-v2",
  "colors": {
    "primary":    "#2D2D2D",
    "accent":     "#C8A96E",
    "background": "#FAF8F4"
  },
  "typography": { "display": "Noto Serif JP", "body": "Inter" },
  "modules": [
    { "type": "HeroBanner",  "props": { "title": "桜花定食", "tagline": "午市限定 · 精致日料" } },
    { "type": "CategoryNav", "props": { "sticky": true } },
    { "type": "MenuGrid",    "props": { "layout": "card", "showDescription": true } },
    { "type": "AIChat",      "props": { "defaultOpen": false, "greeting": "欢迎光临！" } }
  ]
}`}</pre>
            </div>

            <SchemaCard title="Order Schema" subtitle="A3 回流">
              {orderSchemaFields.map((f, i) => (
                <SchemaRow key={f.name} f={f} last={i === orderSchemaFields.length - 1} nameColor={C.green} />
              ))}
            </SchemaCard>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 36, paddingTop: 16,
          borderTop: "1px solid " + C.border,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 11, color: C.textDim }}>
            Demo Scope · B端 B1–B4 · C端 C1–C4 · AI 中台 A1–A3
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: C.green,
            background: C.greenLight, padding: "3px 10px",
            borderRadius: 4, border: "1px solid " + C.green + "33",
          }}>P0 核心链路已覆盖</span>
        </div>

      </div>
    </div>
  );
}
