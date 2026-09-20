/* ============================================================
 * templates.js - 示例患者模板库
 * 提供常见康复病例的一键载入：完整评估 + 量表 + 康复方案
 * ============================================================ */
(function() {
  if (window.__REHAB_TEMPLATES_LOADED__) return;
  window.__REHAB_TEMPLATES_LOADED__ = true;


const PATIENT_TEMPLATES = [
  {
    key: 'lumbar',
    name: '腰椎间盘突出症',
    desc: '腰痛伴右下肢放射痛 3 周，L4-5 椎间盘突出',
    tag: '肌骨',
    tagCls: 'msk',
    patient: {
      name: '示例·王先生', gender: '男', age: 38,
      diagnosis: '腰椎间盘突出症 (L4-5)', tag: '肌骨', tagCls: 'msk',
      phone: '138****0001', color: '#0e9488', lastVisit: '今天', pending: false,
      assessment: {
        chiefComplaint: { symptoms: '腰痛伴右下肢放射痛', onset: '3周前', triggers: '搬重物', history: '腰椎MRI示L4-5椎间盘突出，压迫右侧神经根' },
        palpation: { sites: ['腰椎', '骶髂关节'], painLevel: 7, findings: 'L4-5棘突及棘突旁压痛(+)，向右下肢放射，直腿抬高试验右侧阳性(30°)' },
        rom: [
          { joint: '腰椎', active: '前屈受限(30°) 后伸受限(10°)', passive: '前屈诱发下肢放射痛' },
          { joint: '右髋', active: '外展稍受限', passive: '被动活动度正常' }
        ],
        muscle: [
          { group: '股四头肌', grade: 4, note: '右侧稍弱' },
          { group: '胫前肌', grade: 4, note: '肌力减退' }
        ],
        adl: { '穿衣': 3, '进食': 5, '如厕': 3, '洗澡': 2, '行走': 2, '上下楼': 1 }
      },
      exams: [
        { name: '直腿抬高试验', category: '腰椎', result: 'positive' },
        { name: 'FABER试验', category: '髋关节', result: 'negative' }
      ],
      scales: [
        { key: 'VAS', name: 'VAS疼痛评分', score: '7/10', conclusion: '重度疼痛（7-10）', date: '今天' },
        { key: 'ODI', name: 'Oswestry功能障碍指数', score: '58%', conclusion: '重度功能障碍（40-60%）', date: '昨天' }
      ],
      plan: {
        acute: { goal: '急性期(0-2周) 缓解疼痛、消除炎症', items: ['绝对卧床休息3-5天', '骨盆牵引 每日1次', '中频电疗 每日1次', '口服消炎镇痛药（遵医嘱）'] },
        subacute: { goal: '亚急性期(2-6周) 改善活动度、增强核心', items: ['麦肯基疗法 每日2次', '核心肌群训练', '腰椎稳定性训练'] },
        chronic: { goal: '慢性期(6周+) 重返工作、防止复发', items: ['渐进式抗阻训练', '功能性训练', '姿势与搬重物健康教育'] }
      }
    }
  },
  {
    key: 'stroke',
    name: '脑卒中偏瘫',
    desc: '脑梗死恢复期，右侧偏瘫伴言语不清',
    tag: '神经',
    tagCls: 'neuro',
    patient: {
      name: '示例·刘女士', gender: '女', age: 62,
      diagnosis: '脑梗死(恢复期) 右侧偏瘫', tag: '神经', tagCls: 'neuro',
      phone: '139****0002', color: '#3b82c4', lastVisit: '今天', pending: false,
      assessment: {
        chiefComplaint: { symptoms: '右侧肢体无力伴言语不清', onset: '2月前', triggers: '脑卒中', history: '高血压10年，糖尿病5年。头颅MRI：左侧基底节区梗死灶' },
        palpation: { sites: ['颈椎', '肩关节', '髋关节'], painLevel: 2, findings: '四肢肌张力增高，右侧肢体明显，关节被动活动阻力增大' },
        rom: [
          { joint: '右肩', active: '前屈30° 外展20°', passive: '被动活动度可，末端有阻力' },
          { joint: '右踝', active: '背屈0° 跖屈20°', passive: '被动背屈受限' }
        ],
        muscle: [
          { group: '三角肌', grade: 3, note: '减弱' },
          { group: '胫前肌', grade: 2, note: '足背屈无力' }
        ],
        adl: { '穿衣': 2, '进食': 3, '如厕': 2, '洗澡': 1, '行走': 1, '上下楼': 0 }
      },
      exams: [
        { name: '巴宾斯基征', category: '神经', result: 'positive' },
        { name: '霍夫曼征', category: '神经', result: 'positive' }
      ],
      scales: [
        { key: 'Barthel', name: 'Barthel指数', score: '35/100', conclusion: '重度依赖', date: '今天' },
        { key: 'Brunnstrom', name: 'Brunnstrom分期', score: 'III期', conclusion: '上肢III期 下肢III期', date: '今天' },
        { key: 'BBS', name: 'Berg平衡量表', score: '18/56', conclusion: '高跌倒风险', date: '昨天' }
      ],
      plan: {
        acute: { goal: '急性期 良肢位摆放、预防并发症', items: ['良肢位摆放', '关节被动活动度训练', '神经肌肉电刺激(NMES)', '吞咽与言语评估'] },
        subacute: { goal: '恢复期 促进分离运动、改善平衡', items: ['Bobath技术 每日1次', '坐站平衡训练', '作业治疗（穿衣、进食）', '言语训练'] },
        chronic: { goal: '后遗症期 步行能力与生活自理', items: ['步行训练（辅具评估）', '上肢精细动作训练', '社区步行与防跌倒宣教'] }
      }
    }
  },
  {
    key: 'cervical',
    name: '颈椎病(神经根型)',
    desc: '颈肩痛伴左上肢麻木 1 月，C5-6 椎间盘突出',
    tag: '肌骨',
    tagCls: 'msk',
    patient: {
      name: '示例·陈先生', gender: '男', age: 45,
      diagnosis: '颈椎病(神经根型) C5-6', tag: '肌骨', tagCls: 'msk',
      phone: '137****0003', color: '#8b5fbf', lastVisit: '今天', pending: false,
      assessment: {
        chiefComplaint: { symptoms: '颈肩痛伴左上肢麻木', onset: '1月前', triggers: '长期伏案', history: '文员工作10年，颈椎MRI示C5-6椎间盘突出，左侧神经根受压' },
        palpation: { sites: ['颈椎', '斜方肌'], painLevel: 5, findings: 'C5-6棘突旁压痛(+)，左侧臂丛神经牵拉试验阳性' },
        rom: [
          { joint: '颈椎', active: '后伸受限(20°) 左旋受限(45°)', passive: '左旋时左上肢麻木加重' },
          { joint: '左肩', active: '外展正常', passive: '正常' }
        ],
        muscle: [
          { group: '肱二头肌', grade: 4, note: '左侧稍弱' },
          { group: '伸腕肌群', grade: 4, note: '左侧稍弱' }
        ],
        adl: { '穿衣': 4, '进食': 5, '如厕': 5, '洗澡': 4, '行走': 5, '上下楼': 5 }
      },
      exams: [
        { name: '臂丛神经牵拉试验', category: '颈椎', result: 'positive' },
        { name: '椎间孔挤压试验', category: '颈椎', result: 'suspect' }
      ],
      scales: [
        { key: 'NDI', name: '颈椎功能障碍指数(NDI)', score: '32/50', conclusion: '中度功能障碍', date: '今天' },
        { key: 'VAS', name: 'VAS疼痛评分', score: '5/10', conclusion: '中度疼痛（4-6）', date: '今天' }
      ],
      plan: {
        acute: { goal: '急性期 减轻神经根刺激、缓解疼痛', items: ['颈托制动（短期）', '颈牵引 每日1次', '消炎镇痛药（遵医嘱）'] },
        subacute: { goal: '恢复期 改善活动度、强化颈深屈肌', items: ['颈椎稳定性训练', '颈深屈肌激活训练', '肩胛骨控制训练'] },
        chronic: { goal: '维持期 防复发、改善工作体位', items: ['工位人机工效调整', '颈肩部拉伸 每工作1小时', '有氧运动（快走/游泳）'] }
      }
    }
  },
  {
    key: 'tka',
    name: '全膝关节置换术后',
    desc: '右膝 TKA 术后 2 周，屈曲 80°',
    tag: '肌骨',
    tagCls: 'msk',
    patient: {
      name: '示例·赵女士', gender: '女', age: 68,
      diagnosis: '右膝骨性关节炎 TKA术后', tag: '肌骨', tagCls: 'msk',
      phone: '136****0004', color: '#d9804a', lastVisit: '今天', pending: true,
      assessment: {
        chiefComplaint: { symptoms: '右膝关节僵硬、活动受限', onset: 'TKA术后2周', triggers: '骨关节炎终末期', history: '右膝骨关节炎15年，2周前行全膝关节置换术，术后恢复良好' },
        palpation: { sites: ['右膝关节'], painLevel: 4, findings: '术口愈合良好，无红肿，髌骨活动度可，关节周围轻度肿胀' },
        rom: [
          { joint: '右膝', active: '屈曲80° 伸直-10°', passive: '屈曲90° 伸直-5°' },
          { joint: '右髋', active: '正常', passive: '正常' }
        ],
        muscle: [
          { group: '股四头肌', grade: 3, note: '术后萎缩明显' },
          { group: '腘绳肌', grade: 4, note: '稍弱' }
        ],
        adl: { '穿衣': 3, '进食': 5, '如厕': 3, '洗澡': 2, '行走': 2, '上下楼': 1 }
      },
      exams: [
        { name: '膝关节活动度测量', category: '膝关节', result: 'positive', resultLabel: '屈曲80°' },
        { name: '关节肿胀评估', category: '膝关节', result: 'suspect' }
      ],
      scales: [
        { key: 'Lysholm', name: 'Lysholm膝关节评分', score: '72/100', conclusion: '良（70-84）', date: '今天' },
        { key: 'VAS', name: 'VAS疼痛评分', score: '4/10', conclusion: '中度疼痛（4-6）', date: '今天' }
      ],
      plan: {
        acute: { goal: '术后早期(0-6周) 消肿止痛、恢复活动度', items: ['冰敷+抬高患肢', 'CPM机被动屈伸 每日2次', '股四头肌等长收缩', '伸直位牵伸训练'] },
        subacute: { goal: '术后中期(6-12周) 肌力恢复、步态矫正', items: ['闭链肌力训练', '上下台阶训练（逐步）', '本体感觉与平衡训练'] },
        chronic: { goal: '术后后期(12周+) 功能回归、防跌倒', items: ['抗阻力量训练', '室外步行训练', '骨质疏松与防跌倒宣教'] }
      }
    }
  },
  {
    key: 'frozen',
    name: '肩周炎(冻结肩)',
    desc: '左肩疼痛伴活动受限 4 月',
    tag: '肌骨',
    tagCls: 'msk',
    patient: {
      name: '示例·孙女士', gender: '女', age: 52,
      diagnosis: '左肩冻结肩(粘连性关节囊炎)', tag: '肌骨', tagCls: 'msk',
      phone: '135****0005', color: '#4f9e63', lastVisit: '昨天', pending: false,
      assessment: {
        chiefComplaint: { symptoms: '左肩疼痛伴活动受限，夜间痛明显', onset: '4月前', triggers: '无明显诱因', history: '糖尿病3年。X线未见明显异常，超声示肩袖完整、关节囊增厚' },
        palpation: { sites: ['左肩关节'], painLevel: 6, findings: '结节间沟及喙突区压痛(+)，各方向活动度均受限，以外旋、外展为著' },
        rom: [
          { joint: '左肩', active: '前屈90° 外展70° 外旋10°', passive: '前屈100° 外展80° 外旋15°（末端硬性受限）' },
          { joint: '左肘', active: '正常', passive: '正常' }
        ],
        muscle: [
          { group: '三角肌', grade: 4, note: '轻度萎缩' },
          { group: '冈下肌', grade: 4, note: '轻度萎缩' }
        ],
        adl: { '穿衣': 2, '进食': 4, '如厕': 4, '洗澡': 3, '行走': 5, '上下楼': 5 }
      },
      exams: [
        { name: 'Apley摸背试验', category: '肩关节', result: 'positive' },
        { name: 'Neer撞击试验', category: '肩关节', result: 'suspect' }
      ],
      scales: [
        { key: 'Constant', name: 'Constant-Murley肩关节评分', score: '42/100', conclusion: '差（<60）', date: '今天' },
        { key: 'DASH', name: 'DASH上肢功能障碍问卷', score: '68/100', conclusion: '重度功能障碍', date: '昨天' }
      ],
      plan: {
        acute: { goal: '疼痛期(0-3月) 控制疼痛、防止粘连加重', items: ['关节松动术(I-II级) 轻柔', '钟摆训练', '物理因子治疗（超声波、中频）'] },
        subacute: { goal: '冻结期(3-9月) 改善活动度、松解粘连', items: ['关节松动术(III-IV级)', '滑轮辅助训练', '肩袖与肩胛稳定肌激活'] },
        chronic: { goal: '解冻期(9月+) 恢复功能、回归生活', items: ['弹力带渐进抗阻训练', '过头投掷等功能性训练', '家庭训练计划+夜间睡姿指导'] }
      }
    }
  }
];

/* ---------- 按 key 取模板并生成唯一患者 ---------- */
function loadTemplate(key) {
  const tpl = PATIENT_TEMPLATES.filter(function (t) { return t.key === key; })[0];
  if (!tpl) return null;
  const p = JSON.parse(JSON.stringify(tpl.patient));
  p.id = 'p-tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  return p;
}

window.PatientTemplates = {
  list: PATIENT_TEMPLATES,
  loadTemplate: loadTemplate
};
})();