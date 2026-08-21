/* ============================================================
   个人康复工作台 · Mock 数据（原型演示用，纯前端，无后端）
   ============================================================ */
window.DB = {
  therapist: {
    name: "张医生",
    department: "康复医学科",
    role: "主管治疗师",
    avatar: "张"
  },

  stats: {
    todayAppt: 6,
    todayDone: 4,
    todayRecords: 5,
    totalPatients: 128,
    pending: 3,
    todos: 5
  },

  patients: [
    {
      id: "p-lumbar", name: "张先生", gender: "男", age: 38,
      diagnosis: "腰椎间盘突出症 (L4-5)", tag: "肌骨", tagCls: "msk",
      phone: "138****5678", color: "#0e9488", lastVisit: "今天 09:30", pending: false,
      assessment: {
        chiefComplaint: { symptoms: "腰痛伴右下肢放射痛", onset: "3周前", triggers: "搬重物", history: "腰椎MRI示L4-5椎间盘突出，压迫右侧神经根" },
        palpation: { sites: ["腰椎", "骶髂关节"], painLevel: 7, findings: "L4-5棘突及棘突旁压痛(+)，向右下肢放射，直腿抬高试验右侧阳性(30°)" },
        rom: [
          { joint: "腰椎", active: "前屈受限(30°) 后伸受限(10°)", passive: "前屈诱发下肢放射痛" },
          { joint: "右髋", active: "外展稍受限", passive: "40° 正常" }
        ],
        muscle: [
          { group: "股四头肌", grade: 4, note: "右侧稍弱" },
          { group: "胫前肌", grade: 4, note: "肌力减退" }
        ],
        adl: { "穿衣": 3, "进食": 5, "如厕": 3, "洗澡": 2, "行走": 2, "上下楼": 1 }
      },
      exams: [
        { name: "直腿抬高试验", category: "腰椎", result: "positive" },
        { name: "FABER试验", category: "髋关节", result: "negative" }
      ],
      scales: [
        { key: "VAS", name: "VAS疼痛评分", score: "7/10", conclusion: "重度疼痛", date: "今天" },
        { key: "ODI", name: "Oswestry功能障碍指数", score: "58%", conclusion: "重度功能障碍", date: "昨天" }
      ],
      plan: {
        acute: { goal: "急性期(0-2周) 缓解疼痛、消除炎症", items: ["绝对卧床休息3-5天", "骨盆牵引 每日1次", "中频电疗 每日1次"] },
        subacute: { goal: "亚急性期(2-6周) 改善活动度、增强核心", items: ["麦肯基疗法 每日2次", "核心肌群训练", "腰椎稳定性训练"] },
        chronic: { goal: "慢性期(6周+) 重返工作、防止复发", items: ["渐进式抗阻训练", "功能性训练", "健康教育"] }
      }
    },
    {
      id: "p-stroke", name: "李女士", gender: "女", age: 62,
      diagnosis: "脑梗死(恢复期) 右侧偏瘫", tag: "神经", tagCls: "neuro",
      phone: "139****1234", color: "#3b82c4", lastVisit: "今天 10:30", pending: false,
      assessment: {
        chiefComplaint: { symptoms: "右侧肢体无力伴言语不清", onset: "2月前", triggers: "脑卒中", history: "高血压10年，糖尿病5年。头颅MRI：左侧基底节区梗死灶" },
        palpation: { sites: ["颈椎", "肩关节", "髋关节"], painLevel: 2, findings: "四肢肌张力增高，右侧肢体明显，关节被动活动阻力增大" },
        rom: [
          { joint: "右肩", active: "前屈30° 外展20°", passive: "被动尚可但有阻力" },
          { joint: "右踝", active: "背屈0° 跖屈20°", passive: "被动背屈受限" }
        ],
        muscle: [
          { group: "三角肌", grade: 3, note: "减弱" },
          { group: "胫前肌", grade: 2, note: "足背屈无力" }
        ],
        adl: { "穿衣": 2, "进食": 3, "如厕": 2, "洗澡": 1, "行走": 1, "上下楼": 0 }
      },
      exams: [
        { name: "巴宾斯基征", category: "神经", result: "positive" },
        { name: "霍夫曼征", category: "神经", result: "positive" }
      ],
      scales: [
        { key: "Barthel", name: "Barthel指数", score: "35/100", conclusion: "中度依赖", date: "今天" },
        { key: "BBS", name: "Berg平衡量表", score: "18/56", conclusion: "高跌倒风险", date: "3天前" },
        { key: "MMSE", name: "MMSE简易精神状态", score: "24/30", conclusion: "正常", date: "3天前" }
      ],
      plan: {
        acute: { goal: "急性期 维持关节活动度、预防并发症", items: ["良肢位摆放 24小时", "关节被动活动度训练", "神经肌肉电刺激"] },
        subacute: { goal: "亚急性期 建立主动运动、抑制异常模式", items: ["Bobath技术 抑制痉挛", "平衡训练(坐-站)", "吞咽功能训练"] },
        chronic: { goal: "慢性期 提高ADL、重返社会", items: ["独立步行训练", "精细动作训练", "认知康复训练"] }
      }
    },
    {
      id: "p-cervical", name: "王女士", gender: "女", age: 55,
      diagnosis: "脊髓型颈椎病", tag: "肌骨", tagCls: "msk",
      phone: "137****2345", color: "#8b5fbf", lastVisit: "昨天 15:00", pending: false,
      assessment: {
        chiefComplaint: { symptoms: "四肢麻木无力 踩棉花感", onset: "2月前", triggers: "无明显诱因", history: "颈椎MRI：C3-7椎间盘后突伴椎管狭窄" },
        palpation: { sites: ["颈椎", "肩胛骨"], painLevel: 4, findings: "颈椎棘突压痛，Hoffmann征(+)" },
        rom: [{ joint: "颈椎", active: "旋转受限 30°", passive: "诱发上肢麻木" }],
        muscle: [{ group: "肱二头肌", grade: 4, note: "" }],
        adl: { "穿衣": 4, "进食": 4, "行走": 3 }
      },
      exams: [{ name: "霍夫曼征", category: "神经", result: "positive" }],
      scales: [
        { key: "NDI", name: "NDI颈椎功能障碍指数", score: "32%", conclusion: "中度功能障碍", date: "昨天" },
        { key: "JOAC", name: "JOA颈椎评分", score: "11/17", conclusion: "轻度损害", date: "昨天" }
      ],
      plan: {
        acute: { goal: "急性期 减轻脊髓水肿", items: ["颈部制动", "神经营养药物"] },
        subacute: { goal: "亚急性期 恢复神经功能", items: ["颈椎稳定性训练", "上肢神经松动术"] },
        chronic: { goal: "慢性期 重建功能", items: ["颈椎核心稳定训练", "姿势矫正训练"] }
      }
    },
    {
      id: "p-tka", name: "赵先生", gender: "男", age: 68,
      diagnosis: "左膝关节置换术后 (TKA)", tag: "肌骨", tagCls: "msk",
      phone: "136****3456", color: "#d9804a", lastVisit: "3天前", pending: true,
      assessment: null,
      exams: [],
      scales: [
        { key: "Lysholm", name: "Lysholm膝关节评分", score: "72/100", conclusion: "中等恢复", date: "3天前" },
        { key: "VAS", name: "VAS疼痛评分", score: "3/10", conclusion: "轻度疼痛", date: "3天前" }
      ],
      plan: {
        acute: { goal: "术后早期 控制肿胀", items: ["冰敷 每日3次", "踝泵训练"] },
        subacute: { goal: "术后中期 改善ROM", items: ["直腿抬高训练", "平衡板训练"] },
        chronic: { goal: "术后后期 重返日常", items: ["渐进性抗阻训练", "本体感觉训练"] }
      }
    },
    {
      id: "p-shoulder", name: "孙女士", gender: "女", age: 52,
      diagnosis: "右肩关节周围炎(冻结期)", tag: "肌骨", tagCls: "msk",
      phone: "135****4567", color: "#4f9e63", lastVisit: "1周前", pending: false,
      assessment: null,
      exams: [{ name: "Neer撞击试验", category: "肩关节", result: "positive" }],
      scales: [
        { key: "Constant", name: "Constant肩关节评分", score: "42/100", conclusion: "差", date: "1周前" },
        { key: "DASH", name: "DASH上肢功能障碍", score: "68/100", conclusion: "显著障碍", date: "1周前" }
      ],
      plan: {
        acute: { goal: "疼痛期 消炎止痛", items: ["口服NSAID", "超声治疗"] },
        subacute: { goal: "僵硬期 恢复ROM", items: ["关节松动术", "爬墙运动"] },
        chronic: { goal: "恢复期 增强肌力", items: ["冈上肌等长训练", "功能性训练"] }
      }
    }
  ],

  schedule: [
    { id: "a1", patientId: "p-lumbar", time: "08:30", type: "评估", note: "腰椎·首评", color: "#0e9488" },
    { id: "a2", patientId: "p-stroke", time: "10:30", type: "量表", note: "Barthel + BBS", color: "#3b82c4" },
    { id: "a3", patientId: "p-cervical", time: "11:30", type: "治疗", note: "颈椎松动术", color: "#8b5fbf" },
    { id: "a4", patientId: "p-lumbar", time: "14:00", type: "治疗", note: "牵引 + 中频", color: "#0e9488" },
    { id: "a5", patientId: "p-tka", time: "15:30", type: "评估", note: "TKA术后6周复查", color: "#d9804a" },
    { id: "a6", patientId: "p-stroke", time: "16:30", type: "治疗", note: "步态训练", color: "#3b82c4" }
  ],

  todos: [
    { id: "t1", text: "跟进 李女士 Barthel 复评", level: "high", done: false, due: "今天" },
    { id: "t2", text: "整理本周评估报告归档", level: "mid", done: false, due: "今天" },
    { id: "t3", text: "联系 赵先生 预约膝关节复查", level: "high", done: false, due: "今天" },
    { id: "t4", text: "补充 孙女士 康复方案执行记录", level: "low", done: true, due: "昨天" },
    { id: "t5", text: "更新收费项目对照表", level: "low", done: false, due: "本周" }
  ],

  checkins: [
    { id: "c1", name: "晨间拉伸", emoji: "🧘", done: true, streak: 12 },
    { id: "c2", name: "文献阅读 30min", emoji: "📖", done: true, streak: 8 },
    { id: "c3", name: "病例复盘", emoji: "📝", done: false, streak: 5 },
    { id: "c4", name: "器械消毒", emoji: "🧼", done: true, streak: 20 }
  ],

  scaleLibrary: [
    { key: "VAS", name: "VAS疼痛评分", category: "疼痛评估", ic: "m1" },
    { key: "NRS", name: "NRS数字评分", category: "疼痛评估", ic: "m1" },
    { key: "ODI", name: "Oswestry功能障碍", category: "疼痛评估", ic: "m1" },
    { key: "NDI", name: "NDI颈椎功能障碍", category: "颈肩评估", ic: "m2" },
    { key: "Barthel", name: "Barthel指数", category: "功能与生活能力", ic: "m2" },
    { key: "BBS", name: "Berg平衡量表", category: "平衡与步行", ic: "m2" },
    { key: "MMSE", name: "MMSE精神状态", category: "心理状态", ic: "m3" },
    { key: "Constant", name: "Constant肩关节评分", category: "上肢评估", ic: "m4" },
    { key: "Lysholm", name: "Lysholm膝关节评分", category: "下肢评估", ic: "m4" },
    { key: "Walk6Min", name: "6分钟步行试验", category: "心肺评估", ic: "m5" }
  ],

  /* 治疗记录（记录中心主线数据） */
  records: [
    { id: "r1", patientId: "p-stroke", type: "treatment", title: "治疗记录", summary: "步态训练 + 平衡训练（Bobath）", date: "今天", time: "16:30" },
    { id: "r2", patientId: "p-lumbar", type: "treatment", title: "治疗记录", summary: "骨盆牵引 20min + 中频电疗", date: "今天", time: "14:00" },
    { id: "r3", patientId: "p-stroke", type: "scale", title: "Berg 平衡量表", summary: "18/56 · 高跌倒风险", date: "今天", time: "10:35" },
    { id: "r4", patientId: "p-stroke", type: "scale", title: "Barthel 指数", summary: "35/100 · 中度依赖", date: "今天", time: "10:30" },
    { id: "r5", patientId: "p-lumbar", type: "assessment", title: "主诉评估", summary: "主诉完成 · VAS 7/10 · 直腿抬高右侧(+)", date: "今天", time: "09:30" },
    { id: "r6", patientId: "p-cervical", type: "plan", title: "康复方案", summary: "三阶段方案更新（脊髓型颈椎病）", date: "昨天", time: "15:40" },
    { id: "r7", patientId: "p-stroke", type: "exam", title: "巴宾斯基征", summary: "阳性 · 神经科特殊检查", date: "昨天", time: "15:20" },
    { id: "r8", patientId: "p-cervical", type: "assessment", title: "主诉评估", summary: "四肢麻木 · Hoffmann 征(+)", date: "昨天", time: "15:00" },
    { id: "r9", patientId: "p-lumbar", type: "scale", title: "Oswestry 功能障碍", summary: "58% · 重度功能障碍", date: "昨天", time: "11:00" },
    { id: "r10", patientId: "p-stroke", type: "plan", title: "康复方案", summary: "Bobath 技术 · 三阶段方案制定", date: "3天前", time: "14:00" },
    { id: "r11", patientId: "p-tka", type: "photo", title: "体态照片", summary: "左膝正侧位照片 2 张", date: "3天前", time: "09:15" },
    { id: "r12", patientId: "p-tka", type: "scale", title: "Lysholm 膝关节评分", summary: "72/100 · 中等恢复", date: "3天前", time: "09:00" },
    { id: "r13", patientId: "p-shoulder", type: "scale", title: "Constant 肩关节评分", summary: "42/100 · 差，需积极康复", date: "1周前", time: "10:10" },
    { id: "r14", patientId: "p-shoulder", type: "exam", title: "Neer 撞击试验", summary: "阳性 · 肩关节特殊检查", date: "1周前", time: "10:00" }
  ]
};

/* 通过 patientId 查患者 */
window.getPatient = function (id) {
  return DB.patients.find(function (p) { return p.id === id; });
};