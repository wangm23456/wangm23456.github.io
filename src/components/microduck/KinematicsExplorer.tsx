import { useState, useMemo } from 'react';

interface JointSpec {
  id: number;
  name: string;
  cnName: string;
  group: 'head' | 'left_leg' | 'right_leg' | 'jaw';
  motorModel: string;
  uartId: number;
  rangeDeg: [number, number];
  nominalDeg: number;
  busSpeed: string;
  resolution: string;
  role: string;
}

const JOINTS_DATABASE: JointSpec[] = [
  { id: 0, name: 'left_hip_yaw', cnName: '左髋偏航 (Hip Yaw)', group: 'left_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 20, rangeDeg: [-45, 45], nominalDeg: 0, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '双足航向偏转与骨盆水平旋转' },
  { id: 1, name: 'left_hip_roll', cnName: '左髋横滚 (Hip Roll)', group: 'left_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 21, rangeDeg: [-30, 45], nominalDeg: 5, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '侧倾摆动，左右双足间质心转移' },
  { id: 2, name: 'left_hip_pitch', cnName: '左髋俯仰 (Hip Pitch)', group: 'left_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 22, rangeDeg: [-60, 90], nominalDeg: 25, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '大腿主摆动链，提供向前跨步推力' },
  { id: 3, name: 'left_knee', cnName: '左膝俯仰 (Knee Pitch)', group: 'left_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 23, rangeDeg: [-10, 110], nominalDeg: 45, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '膝关节深度屈伸，垂直减震与蹲伏' },
  { id: 4, name: 'left_ankle', cnName: '左踝俯仰 (Ankle Pitch)', group: 'left_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 24, rangeDeg: [-50, 50], nominalDeg: -20, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '足掌接地姿态与离地蹬力调节' },
  { id: 5, name: 'neck_pitch', cnName: '颈部基座俯仰 (Neck Pitch)', group: 'head', motorModel: 'Dynamixel XL330-M077-T', uartId: 30, rangeDeg: [-35, 40], nominalDeg: 0, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '颈椎俯仰基座，扩展头部前伸范围' },
  { id: 6, name: 'head_pitch', cnName: '头部视线俯仰 (Head Pitch)', group: 'head', motorModel: 'Dynamixel XL330-M077-T', uartId: 31, rangeDeg: [-45, 45], nominalDeg: 0, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '相机与 ToF 视线上下仰俯扫描' },
  { id: 7, name: 'head_yaw', cnName: '头部航向偏航 (Head Yaw)', group: 'head', motorModel: 'Dynamixel XL330-M077-T', uartId: 32, rangeDeg: [-70, 70], nominalDeg: 0, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '独立于躯干朝向的水平环视' },
  { id: 8, name: 'head_roll', cnName: '头部侧倾横滚 (Head Roll)', group: 'head', motorModel: 'Dynamixel XL330-M077-T', uartId: 33, rangeDeg: [-30, 30], nominalDeg: 0, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '侧倾歪头表达拟人情绪与视平补偿' },
  { id: 9, name: 'right_hip_yaw', cnName: '右髋偏航 (Hip Yaw)', group: 'right_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 10, rangeDeg: [-45, 45], nominalDeg: 0, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '右侧骨盆偏航与对称步态调整' },
  { id: 10, name: 'right_hip_roll', cnName: '右髋横滚 (Hip Roll)', group: 'right_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 11, rangeDeg: [-45, 30], nominalDeg: -5, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '右腿外展与内收侧倾控制' },
  { id: 11, name: 'right_hip_pitch', cnName: '右髋俯仰 (Hip Pitch)', group: 'right_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 12, rangeDeg: [-60, 90], nominalDeg: 25, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '右大腿前后摆动驱动' },
  { id: 12, name: 'right_knee', cnName: '右膝俯仰 (Knee Pitch)', group: 'right_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 13, rangeDeg: [-10, 110], nominalDeg: 45, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '右膝关节屈伸' },
  { id: 13, name: 'right_ankle', cnName: '右踝俯仰 (Ankle Pitch)', group: 'right_leg', motorModel: 'Dynamixel XL330-M288-T', uartId: 14, rangeDeg: [-50, 50], nominalDeg: -20, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '右足触地缓冲与离地推进' },
  { id: 14, name: 'jaw', cnName: '下喙开合抓取 (Articulated Jaw)', group: 'jaw', motorModel: 'Dynamixel XL330-M077-T', uartId: 34, rangeDeg: [0, 40], nominalDeg: 5, busSpeed: '1.0 Mbps', resolution: '4096 CPR (0.088°)', role: '单自由度张合机构，支持触地舀取物体' },
];

type PoseMode = 'stand' | 'crouch' | 'ground_pick' | 'roller_glide' | 'fall_alert';

export default function KinematicsExplorer() {
  const [selectedJointId, setSelectedJointId] = useState<number>(3); // default left_knee
  const [pose, setPose] = useState<PoseMode>('stand');
  const [showBusIds, setShowBusIds] = useState<boolean>(true);
  const [showCoM, setShowCoM] = useState<boolean>(true);
  const [showTofBeam, setShowTofBeam] = useState<boolean>(true);
  const [showAngleArcs, setShowAngleArcs] = useState<boolean>(true);

  // Manual interactive angle offsets
  const [kneeAngle, setKneeAngle] = useState<number>(45);
  const [headPitchAngle, setHeadPitchAngle] = useState<number>(0);
  const [hipPitchAngle, setHipPitchAngle] = useState<number>(25);
  const [jawOpenDeg, setJawOpenDeg] = useState<number>(8);

  const selectedJoint = useMemo(
    () => JOINTS_DATABASE.find((j) => j.id === selectedJointId) || JOINTS_DATABASE[0],
    [selectedJointId]
  );

  const handlePreset = (p: PoseMode) => {
    setPose(p);
    if (p === 'stand') {
      setHipPitchAngle(25);
      setKneeAngle(45);
      setHeadPitchAngle(0);
      setJawOpenDeg(5);
    } else if (p === 'crouch') {
      setHipPitchAngle(55);
      setKneeAngle(85);
      setHeadPitchAngle(15);
      setJawOpenDeg(5);
    } else if (p === 'ground_pick') {
      setHipPitchAngle(75);
      setKneeAngle(95);
      setHeadPitchAngle(40);
      setJawOpenDeg(35);
    } else if (p === 'roller_glide') {
      setHipPitchAngle(40);
      setKneeAngle(60);
      setHeadPitchAngle(-5);
      setJawOpenDeg(0);
    } else if (p === 'fall_alert') {
      setHipPitchAngle(80);
      setKneeAngle(15);
      setHeadPitchAngle(35);
      setJawOpenDeg(20);
    }
  };

  // Kinematic calculations for 2D CAD projection
  const isFallen = pose === 'fall_alert';
  const groundY = 320;

  // Base torso origin
  const pelvisX = 220;
  const pelvisY = isFallen ? 245 : groundY - 145 - (1 - kneeAngle / 110) * 45;
  const torsoTiltRad = isFallen ? (60 * Math.PI) / 180 : ((hipPitchAngle - 25) * 0.45 * Math.PI) / 180;

  // Leg Kinematics (Left leg prominent, right leg offset behind in 2.5D)
  const thighLen = 62;
  const shinLen = 65;
  const hipRad = (hipPitchAngle * Math.PI) / 180;
  const kneeRad = (kneeAngle * Math.PI) / 180;

  // Knee position
  const kneeX = pelvisX + thighLen * Math.sin(hipRad);
  const kneeY = pelvisY + thighLen * Math.cos(hipRad);

  // Ankle position
  const ankleX = kneeX - shinLen * Math.sin(kneeRad - hipRad * 0.6);
  const ankleY = isFallen ? groundY - 20 : groundY - 18;

  // Foot sole coordinates
  const soleStartX = ankleX - 32;
  const soleEndX = ankleX + 38;
  const soleY = groundY - 2;

  // Neck and Head kinematics
  const neckBaseX = pelvisX - 18 * Math.sin(torsoTiltRad);
  const neckBaseY = pelvisY - 48 * Math.cos(torsoTiltRad);

  const headPitchRad = ((headPitchAngle + 5) * Math.PI) / 180 + torsoTiltRad;
  const headDist = 45;
  const headCenterX = neckBaseX + headDist * Math.sin(headPitchRad + 0.35);
  const headCenterY = neckBaseY - headDist * Math.cos(headPitchRad + 0.35);

  // Beak Tip
  const beakLen = 42;
  const beakTipX = headCenterX + beakLen * Math.cos(headPitchRad - 0.05);
  const beakTipY = headCenterY + beakLen * Math.sin(headPitchRad - 0.05);

  // Center of Mass (CoM)
  const comX = (pelvisX * 0.5 + headCenterX * 0.3 + kneeX * 0.2);
  const comY = (pelvisY * 0.6 + headCenterY * 0.4);

  // End-effector telemetry
  const heightCm = (((groundY - headCenterY + 20) / (groundY - 50)) * 25).toFixed(1);
  const beakXCm = (((beakTipX - pelvisX) / 150) * 15).toFixed(1);
  const beakYCm = (((groundY - beakTipY) / (groundY - 50)) * 25).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {/* Preset & Layer Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--paper-2)',
          padding: '0.5rem 0.8rem',
          border: 'var(--border-thin)',
        }}
      >
        {/* Poses */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--muted)' }}>
            姿态预设:
          </span>
          {[
            { key: 'stand', label: '标准站立 (Stand)' },
            { key: 'crouch', label: '低重心屈膝 (Crouch)' },
            { key: 'ground_pick', label: '喙触地俯冲 (GroundPick)' },
            { key: 'roller_glide', label: '轮滑巡航 (RollerGlide)' },
            { key: 'fall_alert', label: '失衡跌倒 (Fall Limp)' },
          ].map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => handlePreset(btn.key as PoseMode)}
              className={pose === btn.key ? 'active' : ''}
              style={{
                fontSize: '0.68rem',
                padding: '0.2rem 0.5rem',
                background: pose === btn.key ? 'var(--brand)' : 'var(--card)',
                color: pose === btn.key ? '#fff' : 'var(--ink)',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showBusIds} onChange={(e) => setShowBusIds(e.target.checked)} />
            <span>总线 ID</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showCoM} onChange={(e) => setShowCoM(e.target.checked)} />
            <span style={{ color: '#2563eb', fontWeight: 700 }}>质心 CoM</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showTofBeam} onChange={(e) => setShowTofBeam(e.target.checked)} />
            <span style={{ color: '#d97706', fontWeight: 700 }}>ToF 扫描锥</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showAngleArcs} onChange={(e) => setShowAngleArcs(e.target.checked)} />
            <span>角度标尺</span>
          </label>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.25fr) minmax(280px, 1fr)', gap: '0.9rem' }}>
        {/* Left: Precision CAD Blueprint Canvas */}
        <div
          style={{
            border: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
            background: '#090d16',
            color: '#e2e8f0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top HUD Overlay */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '0.4rem 0.7rem',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>● CAD KINEMATIC MODEL</span>
              <span style={{ color: '#94a3b8' }}>SCALE 1:1</span>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <span>高度: <b style={{ color: '#38bdf8' }}>{heightCm} cm</b></span>
              <span>喙尖: <b style={{ color: '#f59e0b' }}>({beakXCm}, {beakYCm})</b></span>
              <span style={{ color: isFallen ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                {isFallen ? 'IMU: FALLEN (LIMP)' : '50Hz STABLE'}
              </span>
            </div>
          </div>

          {/* SVG Blueprint */}
          <svg
            viewBox="0 0 460 350"
            style={{
              width: '100%',
              height: '320px',
              background: 'radial-gradient(circle at 50% 40%, #0f172a 0%, #060911 100%)',
              userSelect: 'none',
            }}
          >
            <defs>
              {/* Millimeter engineering grid */}
              <pattern id="cad_grid_small" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="0.5" />
              </pattern>
              <pattern id="cad_grid_large" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#cad_grid_small)" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
              </pattern>

              {/* Glowing filters */}
              <filter id="glow_blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow_yellow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="460" height="350" fill="url(#cad_grid_large)" />

            {/* Datum Ground Plane */}
            <line x1="20" y1={groundY} x2="440" y2={groundY} stroke="#38bdf8" strokeWidth="2" />
            <line x1="20" y1={groundY + 3} x2="440" y2={groundY + 3} stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="30" y={groundY + 16} fill="#64748b" fontSize="8" fontFamily="var(--font-mono)">
              DATUM PLANE: Z = 0.00 mm (GROUND CONTACT)
            </text>

            {/* Height Caliper Ruler */}
            <g transform="translate(38, 50)">
              <line x1="0" y1="0" x2="0" y2={groundY - 50} stroke="#475569" strokeWidth="1" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#475569" strokeWidth="1" />
              <line x1="-5" y1={groundY - 50} x2="5" y2={groundY - 50} stroke="#475569" strokeWidth="1" />
              <text x="8" y="12" fill="#94a3b8" fontSize="8" fontFamily="var(--font-mono)">250 mm</text>
              <text x="8" y={groundY - 60} fill="#94a3b8" fontSize="8" fontFamily="var(--font-mono)">0 mm</text>
            </g>

            {/* Support Polygon & Ground Reaction Line */}
            {showCoM && (
              <g>
                {/* Foot Support Zone on ground */}
                <rect
                  x={soleStartX - 10}
                  y={groundY - 1}
                  width={soleEndX - soleStartX + 20}
                  height="4"
                  fill="rgba(59, 130, 246, 0.25)"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
                <text x={ankleX} y={groundY + 24} textAnchor="middle" fill="#3b82f6" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="700">
                  [ SUPPORT POLYGON / 支撑多边形 ]
                </text>

                {/* Vertical Gravity Line from CoM */}
                <line
                  x1={comX}
                  y1={comY}
                  x2={comX}
                  y2={groundY}
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                {/* Projected Ground ZMP Point */}
                <circle cx={comX} cy={groundY} r="3" fill="#3b82f6" />

                {/* Center of Mass (CoM) Crosshair */}
                <g transform={`translate(${comX}, ${comY})`} filter="url(#glow_blue)">
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M 0 0 L 6 0 A 6 6 0 0 1 0 6 Z M 0 0 L -6 0 A 6 6 0 0 1 0 -6 Z" fill="#3b82f6" opacity="0.7" />
                  <text x="12" y="-4" fill="#60a5fa" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="800">
                    CoM (质心)
                  </text>
                </g>
              </g>
            )}

            {/* 2.5D Right Leg (Shadow Leg in background) */}
            <g opacity="0.35">
              <line x1={pelvisX + 8} y1={pelvisY + 4} x2={kneeX + 12} y2={kneeY - 4} stroke="#475569" strokeWidth="10" strokeLinecap="round" />
              <line x1={kneeX + 12} y1={kneeY - 4} x2={ankleX + 10} y2={ankleY - 2} stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              <rect x={ankleX - 15} y={groundY - 14} width="50" height="12" rx="4" fill="#334155" />
            </g>

            {/* Torso Subassembly Block (RK3566 + Battery + IMU) */}
            <g transform={`translate(${pelvisX}, ${pelvisY}) rotate(${(torsoTiltRad * 180) / Math.PI})`}>
              {/* Outer Shell Bracket */}
              <rect
                x="-36"
                y="-65"
                width="72"
                height="80"
                rx="16"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="2.5"
              />
              {/* CNC Inner Cavity */}
              <rect x="-30" y="-58" width="60" height="66" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

              {/* Sony NP-F550 Battery Pack */}
              <g transform="translate(-24, -54)">
                <rect x="0" y="0" width="48" height="18" rx="3" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                <rect x="3" y="3" width="42" height="12" fill="#d97706" />
                <text x="24" y="11" textAnchor="middle" fill="#000" fontSize="7" fontFamily="var(--font-mono)" fontWeight="800">
                  NP-F550 2600mAh
                </text>
              </g>

              {/* Rockchip RK3566 Mainboard PCB */}
              <g transform="translate(-24, -30)">
                <rect x="0" y="0" width="48" height="32" rx="3" fill="#065f46" stroke="#047857" strokeWidth="1" />
                {/* RK3566 SoC IC */}
                <rect x="14" y="6" width="20" height="20" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                <text x="24" y="18" textAnchor="middle" fill="#34d399" fontSize="6.5" fontFamily="var(--font-mono)" fontWeight="800">
                  RK3566
                </text>
              </g>

              {/* Body IMU Coordinate Frame Indicator */}
              <g transform="translate(0, 8)">
                <line x1="0" y1="0" x2="16" y2="0" stroke="#ef4444" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#22c55e" strokeWidth="2" />
                <text x="18" y="3" fill="#ef4444" fontSize="7" fontFamily="var(--font-mono)">X</text>
                <text x="-2" y="-18" fill="#22c55e" fontSize="7" fontFamily="var(--font-mono)">Z</text>
              </g>
            </g>

            {/* Left Leg Main Kinematic Spars & Dynamixel XL330 Actuators */}
            {/* 1. Pelvis / Hip Yaw & Roll Servo Housing */}
            <g transform={`translate(${pelvisX}, ${pelvisY})`}>
              <rect x="-16" y="-12" width="32" height="24" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="0" cy="0" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
              {showBusIds && (
                <text x="-22" y="4" textAnchor="end" fill="#38bdf8" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="700">
                  #20/21/22 HIP
                </text>
              )}
            </g>

            {/* Thigh Spar Linkage */}
            <line
              x1={pelvisX}
              y1={pelvisY}
              x2={kneeX}
              y2={kneeY}
              stroke="#38bdf8"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1={pelvisX}
              y1={pelvisY}
              x2={kneeX}
              y2={kneeY}
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* 2. Knee Actuator Block */}
            <g transform={`translate(${kneeX}, ${kneeY})`}>
              <rect x="-14" y="-14" width="28" height="28" rx="5" fill="#020617" stroke={selectedJoint.name.includes('knee') ? '#f59e0b' : '#38bdf8'} strokeWidth="2" />
              <circle cx="0" cy="0" r="9" fill="#1e293b" stroke={selectedJoint.name.includes('knee') ? '#f59e0b' : '#38bdf8'} strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3.5" fill={selectedJoint.name.includes('knee') ? '#f59e0b' : '#38bdf8'} />
              {showBusIds && (
                <text x="18" y="4" fill="#38bdf8" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="700">
                  #23 KNEE
                </text>
              )}
              {showAngleArcs && (
                <text x="16" y="-12" fill="#fbbf24" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">
                  θ={kneeAngle}°
                </text>
              )}
            </g>

            {/* Shin Spar Linkage */}
            <line
              x1={kneeX}
              y1={kneeY}
              x2={ankleX}
              y2={ankleY}
              stroke="#38bdf8"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              x1={kneeX}
              y1={kneeY}
              x2={ankleX}
              y2={ankleY}
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* 3. Ankle Actuator & Foot Assembly */}
            <g transform={`translate(${ankleX}, ${ankleY})`}>
              <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5" fill="#38bdf8" />
              {showBusIds && (
                <text x="-16" y="2" textAnchor="end" fill="#38bdf8" fontSize="7.5" fontFamily="var(--font-mono)">
                  #24 ANKLE
                </text>
              )}
            </g>

            {/* Duck Foot Bracket & Dual-Contact Sole */}
            <polygon
              points={`${soleStartX},${soleY} ${soleEndX},${soleY} ${soleEndX - 6},${soleY - 14} ${soleStartX + 4},${soleY - 14}`}
              fill={pose === 'roller_glide' ? '#f59e0b' : '#1e293b'}
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Ground Contact Pads */}
            <rect x={soleStartX + 2} y={soleY - 2} width="12" height="3" fill="#38bdf8" />
            <rect x={soleEndX - 14} y={soleY - 2} width="12" height="3" fill="#38bdf8" />

            {/* Roller Skate Attachments (Active in roller_glide mode) */}
            {pose === 'roller_glide' && (
              <g transform={`translate(0, ${groundY + 2})`}>
                <circle cx={soleStartX + 8} cy="0" r="7" fill="#020617" stroke="#f59e0b" strokeWidth="2" />
                <circle cx={soleStartX + 8} cy="0" r="2.5" fill="#f59e0b" />
                <circle cx={soleEndX - 8} cy="0" r="7" fill="#020617" stroke="#f59e0b" strokeWidth="2" />
                <circle cx={soleEndX - 8} cy="0" r="2.5" fill="#f59e0b" />
                <line x1={soleStartX - 6} y1="0" x2={soleEndX + 6} y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <text x={soleEndX + 12} y="3" fill="#f59e0b" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="700">
                  PASSIVE WHEELS (0.6 m/s)
                </text>
              </g>
            )}

            {/* Neck Linkage & Gimbal */}
            <line
              x1={neckBaseX}
              y1={neckBaseY}
              x2={headCenterX}
              y2={headCenterY}
              stroke="#64748b"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx={neckBaseX} cy={neckBaseY} r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            {showBusIds && (
              <text x={neckBaseX - 12} y={neckBaseY - 4} textAnchor="end" fill="#38bdf8" fontSize="7.5" fontFamily="var(--font-mono)">
                #30 NECK
              </text>
            )}

            {/* Head Module Subassembly (Head Shell + Camera + 8x8 ToF + Beak) */}
            <g transform={`translate(${headCenterX}, ${headCenterY}) rotate(${(headPitchRad * 180) / Math.PI})`}>
              {/* Ergonomic Head Shell Contour */}
              <path
                d="M -26 -16 C -26 -32, 18 -32, 28 -12 C 34 0, 24 24, -12 24 C -26 24, -26 0, -26 -16 Z"
                fill="#1e293b"
                stroke={selectedJoint.group === 'head' ? '#f59e0b' : '#38bdf8'}
                strokeWidth="2.5"
              />

              {/* Head Gimbal Actuators Stack (#31 Pitch, #32 Yaw, #33 Roll) */}
              <circle cx="-6" cy="0" r="8" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="-6" cy="0" r="3" fill="#38bdf8" />

              {/* Front Camera Optical Assembly */}
              <g transform="translate(18, -4)">
                <rect x="0" y="-8" width="10" height="16" rx="2" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="4" cy="0" r="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="4" cy="0" r="1.5" fill="#38bdf8" />
                {/* On-Air REC Indicator Lamp */}
                <circle cx="5" cy="11" r="2" fill="#ef4444" filter="url(#glow_yellow)" />
              </g>

              {/* 8x8 ToF Depth Sensor Matrix Window */}
              <g transform="translate(16, -20)">
                <rect x="0" y="0" width="12" height="10" rx="1.5" fill="#020617" stroke="#f59e0b" strokeWidth="1.5" />
                {/* 8x8 grid dots representation */}
                <circle cx="3" cy="3" r="0.8" fill="#f59e0b" />
                <circle cx="6" cy="3" r="0.8" fill="#f59e0b" />
                <circle cx="9" cy="3" r="0.8" fill="#f59e0b" />
                <circle cx="3" cy="7" r="0.8" fill="#f59e0b" />
                <circle cx="6" cy="7" r="0.8" fill="#f59e0b" />
                <circle cx="9" cy="7" r="0.8" fill="#f59e0b" />
              </g>

              {/* Articulated Beak (Upper Beak Fixed, Lower Jaw Actuated) */}
              {/* Upper Beak */}
              <polygon
                points="26,-10 48,-2 26,4"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              {/* Lower Jaw Actuated by Joint #34 */}
              <polygon
                points={`26,4 46,${4 + jawOpenDeg * 0.4} 24,${10 + jawOpenDeg * 0.4}`}
                fill="#ea580c"
                stroke="#c2410c"
                strokeWidth="1.5"
              />
              {/* NFC Antenna coil indicator inside beak */}
              <circle cx="34" cy="0" r="3" fill="none" stroke="#000" strokeWidth="0.8" strokeDasharray="1 1" />
            </g>

            {/* 8x8 ToF Laser Depth Cone Visualization */}
            {showTofBeam && (
              <g transform={`translate(${headCenterX}, ${headCenterY}) rotate(${(headPitchRad * 180) / Math.PI})`}>
                <polygon
                  points="28,-15 160,-65 160,35"
                  fill="rgba(245, 158, 11, 0.08)"
                  stroke="rgba(245, 158, 11, 0.35)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x="80" y="-35" fill="#f59e0b" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">
                  VL53L5 ToF 8×8 (64 深度点阵 · 15Hz)
                </text>
              </g>
            )}
          </svg>

          {/* Bottom Interactive Sliders for Live Angle Tweak */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              padding: '0.6rem 0.8rem',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.6rem',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>髋关节俯仰 θ_hip:</span>
                <b style={{ color: '#38bdf8' }}>{hipPitchAngle}°</b>
              </div>
              <input
                type="range"
                min="-20"
                max="85"
                value={hipPitchAngle}
                onChange={(e) => setHipPitchAngle(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>膝关节屈伸 θ_knee:</span>
                <b style={{ color: '#38bdf8' }}>{kneeAngle}°</b>
              </div>
              <input
                type="range"
                min="0"
                max="105"
                value={kneeAngle}
                onChange={(e) => setKneeAngle(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>视线俯仰 θ_head:</span>
                <b style={{ color: '#f59e0b' }}>{headPitchAngle}°</b>
              </div>
              <input
                type="range"
                min="-40"
                max="45"
                value={headPitchAngle}
                onChange={(e) => setHeadPitchAngle(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Right: Detailed Bus Spec Card & Actuator Ledger */}
        <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 800 }}>
              15 自由度总线分配矩阵 (点击选择关节查看微观规约)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
              {JOINTS_DATABASE.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setSelectedJointId(j.id)}
                  style={{
                    fontSize: '0.66rem',
                    padding: '0.15rem 0.35rem',
                    background: selectedJointId === j.id ? 'var(--ink)' : 'var(--paper)',
                    color: selectedJointId === j.id ? '#fff' : 'var(--ink)',
                    border: '1px solid var(--ink)',
                  }}
                >
                  #{j.uartId} {j.name.replace(/left_|right_/, '')}
                </button>
              ))}
            </div>
          </div>

          {/* Active Joint Detail Sheet */}
          <div style={{ border: '2px solid var(--ink)', background: 'var(--paper)', padding: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>
                {selectedJoint.cnName}
              </span>
              <span
                style={{
                  background: 'var(--yellow)',
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  border: '1px solid var(--ink)',
                }}
              >
                UART ID #{selectedJoint.uartId}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', margin: '0.5rem 0', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <div><span style={{ color: 'var(--muted)' }}>电机型号:</span> <b>{selectedJoint.motorModel}</b></div>
              <div><span style={{ color: 'var(--muted)' }}>总线速率:</span> <b>{selectedJoint.busSpeed}</b></div>
              <div><span style={{ color: 'var(--muted)' }}>编码器分辨率:</span> <b>{selectedJoint.resolution}</b></div>
              <div><span style={{ color: 'var(--muted)' }}>限位范围:</span> <b>[{selectedJoint.rangeDeg[0]}°, {selectedJoint.rangeDeg[1]}°]</b></div>
            </div>

            <div style={{ fontSize: '0.72rem', lineHeight: '1.4', background: 'var(--card)', padding: '0.45rem', border: '1px dashed var(--ink)' }}>
              <span style={{ fontWeight: 700, color: 'var(--brand)' }}>动力学职责：</span>
              {selectedJoint.role}。在 50Hz 控制循环中，该关节由 <code>safety.apply</code> 执行硬限位夹紧 (Joint Clamp)，严防撞击注塑壳体。
            </div>

            <div style={{ marginTop: '0.4rem', fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
              MJCF 物理节点：<code>&lt;joint name="{selectedJoint.name}" pos="0 0 0" axis="0 1 0" range="{selectedJoint.rangeDeg[0]} {selectedJoint.rangeDeg[1]}" /&gt;</code>
            </div>
          </div>

          {/* Quick Hardware Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem', fontSize: '0.7rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', padding: '0.35rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.62rem' }}>机身净重</div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>&lt; 800 g</div>
            </div>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', padding: '0.35rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.62rem' }}>控制循环</div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>50.0 Hz</div>
            </div>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', padding: '0.35rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.62rem' }}>相机指示</div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--brand)' }}>REC 硬件灯</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
