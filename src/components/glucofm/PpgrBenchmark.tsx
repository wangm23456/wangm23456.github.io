import { useState } from 'react';

interface MealOption {
  id: string;
  name: string;
  type: string;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  calories: number;
}

const MEAL_OPTIONS: MealOption[] = [
  {
    id: 'shake',
    name: '标准化代餐饮料 (奶昔)',
    type: '标准早餐 (75g CHO)',
    carbs: 75,
    protein: 15,
    fat: 5,
    fiber: 2,
    calories: 405,
  },
  {
    id: 'chipotle',
    name: '复合快餐 (米饭+鸡肉+豆类+酪梨)',
    type: '标准午餐 (高蛋白/高纤)',
    carbs: 85,
    protein: 42,
    fat: 28,
    fiber: 14,
    calories: 760,
  },
  {
    id: 'refined',
    name: '精制碳水 (白面包+含糖果汁)',
    type: '高升糖快速吸收',
    carbs: 95,
    protein: 6,
    fat: 2,
    fiber: 1,
    calories: 420,
  },
];

export default function PpgrBenchmark() {
  const [selectedMeal, setSelectedMeal] = useState<string>('shake');
  const [sensorType, setSensorType] = useState<'dexcom' | 'libre'>('dexcom');
  const [contextLevel, setContextLevel] = useState<number>(4);

  const meal = MEAL_OPTIONS.find((m) => m.id === selectedMeal) || MEAL_OPTIONS[0];

  // Simulated 2-hour PPGR postprandial curve (24 points, 5-min intervals)
  const ppgrPoints = [];
  const baseOffset = sensorType === 'dexcom' ? 105 : 78; // Dexcom abdomen vs Libre arm offset
  const peakMult = selectedMeal === 'refined' ? 1.4 : selectedMeal === 'chipotle' ? 0.9 : 1.1;
  const peakTimeStep = selectedMeal === 'refined' ? 7 : selectedMeal === 'chipotle' ? 13 : 9; // 35min vs 65min vs 45min

  for (let i = 0; i <= 24; i++) {
    const t = i * 5; // minutes 0 to 120
    const rise = 65 * peakMult * Math.exp(-((i - peakTimeStep) ** 2) / (selectedMeal === 'chipotle' ? 36 : 20));
    // Level of context reduces simulation error/variance
    const noiseReduction = contextLevel * 0.2;
    ppgrPoints.push(Math.round(baseOffset + rise * (0.85 + noiseReduction * 0.15)));
  }

  // Model comparison table data
  const COMPARISONS = [
    {
      model: 'GlucoFM (Google)',
      paradigm: '双流解耦 + JEPA 潜变量',
      params: '0.72M',
      pretrain: '10.9万小时 (477人)',
      linearProbe: '58.8',
      ppgrMae: '21.88 mg/dL',
      highlight: true,
    },
    {
      model: 'CGM-JEPA',
      paradigm: '单流掩码潜变量预测',
      params: '0.70M',
      pretrain: '10.9万小时 (477人)',
      linearProbe: '54.7',
      ppgrMae: '24.15 mg/dL',
      highlight: false,
    },
    {
      model: 'CGMformer',
      paradigm: 'Token 离散化 + 掩码重建',
      params: '4.2M',
      pretrain: '1,917天 (964人)',
      linearProbe: '54.1',
      ppgrMae: '25.60 mg/dL',
      highlight: false,
    },
    {
      model: 'GluFormer (Nature 2026)',
      paradigm: '自回归 Next-Token 生成',
      params: '10M+',
      pretrain: '1000万点 (10,812人)',
      linearProbe: '多队列风险',
      ppgrMae: '未公开',
      highlight: false,
    },
    {
      model: 'CGM-LSM (npj 2025)',
      paradigm: '短时序生成预测 (Next-Step)',
      params: 'Decoder',
      pretrain: '1596万条 (592人)',
      linearProbe: '未来2h预测',
      ppgrMae: 'rMSE 15.90',
      highlight: false,
    },
  ];

  return (
    <div style={{ padding: '1.2rem', fontFamily: 'inherit', color: 'var(--ink)' }}>
      {/* Upper: Context level & meal selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.4rem' }}>1. 选择餐食营养场景：</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {MEAL_OPTIONS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMeal(m.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.7rem',
                  border: 'var(--border-thin)',
                  background: selectedMeal === m.id ? 'var(--yellow)' : 'var(--card)',
                  fontWeight: selectedMeal === m.id ? 800 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                <div><strong>{m.name}</strong> <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>({m.type})</span></div>
                <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '0.2rem' }}>
                  碳水 {m.carbs}g · 蛋白 {m.protein}g · 脂肪 {m.fat}g · 纤维 {m.fiber}g · {m.calories} kcal
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.4rem' }}>2. 传感器位置与前置上下文阶梯：</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
            <button
              onClick={() => setSensorType('dexcom')}
              style={{
                flex: 1,
                padding: '0.35rem',
                border: 'var(--border-thin)',
                background: sensorType === 'dexcom' ? 'var(--blue)' : 'var(--card)',
                color: sensorType === 'dexcom' ? '#fff' : 'inherit',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Dexcom G6 (腹部 · 5min)
            </button>
            <button
              onClick={() => setSensorType('libre')}
              style={{
                flex: 1,
                padding: '0.35rem',
                border: 'var(--border-thin)',
                background: sensorType === 'libre' ? 'var(--blue)' : 'var(--card)',
                color: sensorType === 'libre' ? '#fff' : 'inherit',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              FreeStyle Libre (上臂 · 15min)
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', marginBottom: '0.3rem', fontWeight: 700 }}>
            上下文丰富度（输入模型的因果条件）：Level {contextLevel}
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={contextLevel}
            onChange={(e) => setContextLevel(Number(e.target.value))}
            style={{ width: '100%', marginBottom: '0.4rem' }}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--paper-2)', padding: '0.4rem 0.6rem', border: 'var(--border-thin)' }}>
            {contextLevel === 1 && 'Level 1: 仅餐前 1 小时 CGM 读数'}
            {contextLevel === 2 && 'Level 2: 餐前 1 小时 + 餐前 24 小时完整日间时序'}
            {contextLevel === 3 && 'Level 3: 前置 CGM + 五项精细宏量营养素 (碳水/蛋白/脂肪/纤维/热量)'}
            {contextLevel === 4 && 'Level 4 (全上下文): 前置 CGM + 营养素 + 空腹血糖 + BMI + 糖尿病状态'}
          </div>
        </div>
      </div>

      {/* Simulated Postprandial Curve Visualizer */}
      <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.8rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
            2小时餐后血糖轨迹 (PPGR) 预测仿真 · {sensorType === 'dexcom' ? 'Dexcom 腹部' : 'Libre 上臂'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 700 }}>
            {sensorType === 'dexcom' ? 'GlucoFM 实测 MAE: 22.63 mg/dL' : 'GlucoFM 实测 MAE: 21.12 mg/dL'}
          </div>
        </div>

        {/* Mini SVG Chart */}
        <svg viewBox="0 0 500 130" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <rect x="30" y="10" width="455" height="95" fill="var(--paper-2)" opacity="0.4" />
          <line x1="30" y1="105" x2="485" y2="105" stroke="#444" strokeWidth="1.5" />
          <line x1="30" y1="10" x2="30" y2="105" stroke="#444" strokeWidth="1.5" />

          {/* Guide lines */}
          <line x1="30" y1="70" x2="485" y2="70" stroke="#ccc" strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1="30" y1="35" x2="485" y2="35" stroke="#ccc" strokeDasharray="2 2" strokeWidth="0.8" />

          {/* Curve */}
          <path
            d={ppgrPoints.map((pt, idx) => {
              const x = 30 + (idx / 24) * 455;
              const y = 105 - ((pt - 50) / 180) * 95;
              return idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }).join(' ')}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="3"
          />

          {/* Data Points */}
          {ppgrPoints.map((pt, idx) => {
            if (idx % 2 !== 0) return null;
            const x = 30 + (idx / 24) * 455;
            const y = 105 - ((pt - 50) / 180) * 95;
            return <circle key={idx} cx={x} cy={y} r="3" fill="var(--ink)" />;
          })}

          {/* Time Labels */}
          {[0, 30, 60, 90, 120].map((mins) => {
            const x = 30 + (mins / 120) * 455;
            return (
              <text key={mins} x={x} y="122" textAnchor="middle" fontSize="9" fill="var(--muted)">
                +{mins}m
              </text>
            );
          })}
          <text x="15" y="105" textAnchor="middle" fontSize="9" fill="var(--muted)">50</text>
          <text x="15" y="70" textAnchor="middle" fontSize="9" fill="var(--muted)">120</text>
          <text x="15" y="35" textAnchor="middle" fontSize="9" fill="var(--muted)">190</text>
        </svg>

        <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
          *注：CGMacros 数据显示，健康人群在腹部 Dexcom 读数比上臂 Libre 系统性高出约 <strong>58.7 mg/dL</strong>。GlucoFM 在双传感器原生采样率下分别评估，未将跨设备读数混同。
        </div>
      </div>

      {/* Model Benchmark Matrix */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              <th style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>模型</th>
              <th style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>预训练范式</th>
              <th style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>参数量</th>
              <th style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>预训练语料</th>
              <th style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>探针 PR-AUC</th>
              <th style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>PPGR 轨迹 MAE</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISONS.map((row, idx) => (
              <tr key={idx} style={{ background: row.highlight ? 'var(--yellow)' : idx % 2 === 0 ? 'var(--card)' : 'var(--paper-2)' }}>
                <td style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)', fontWeight: 800 }}>{row.model}</td>
                <td style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>{row.paradigm}</td>
                <td style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)', fontFamily: 'var(--font-mono)' }}>{row.params}</td>
                <td style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)' }}>{row.pretrain}</td>
                <td style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)', fontWeight: 800 }}>{row.linearProbe}</td>
                <td style={{ padding: '0.5rem 0.6rem', border: '1px solid var(--ink)', fontFamily: 'var(--font-mono)' }}>{row.ppgrMae}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
