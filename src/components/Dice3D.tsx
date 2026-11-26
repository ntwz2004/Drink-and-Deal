import { useState, useEffect, useRef } from 'react';

interface Props {
  face: number;
  isRolling: boolean;
  onClick: () => void;
  size?: number;
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]],
};

// Final X,Y degrees to show each face
const FACE_ANGLES: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, 90],
  3: [-90, 0],
  4: [90, 0],
  5: [0, -90],
  6: [0, 180],
};

const DiceFace = ({
  dots,
  transform,
  isOne = false,
}: {
  dots: [number, number][];
  transform: string;
  isOne?: boolean;
}) => (
  <div
    className="absolute h-full w-full rounded-2xl"
    style={{
      transform,
      backfaceVisibility: 'hidden',
      background: 'linear-gradient(145deg, hsl(40 25% 99%), hsl(220 15% 89%))',
      border: '1px solid rgba(255, 255, 255, 0.7)',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.85), inset 0 -2px 5px rgba(15,23,42,0.14)',
    }}
  >
    {dots.map(([x, y], i) => (
      <div
        key={i}
        className={`absolute rounded-full ${isOne ? 'h-[22%] w-[22%]' : 'h-[16%] w-[16%]'}`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          background: isOne
            ? 'radial-gradient(circle at 35% 35%, hsl(355 82% 58%), hsl(355 78% 40%))'
            : 'radial-gradient(circle at 35% 35%, hsl(222 25% 28%), hsl(224 32% 10%))',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.22), 0 1px 2px rgba(0,0,0,0.25)',
        }}
      />
    ))}
  </div>
);

const Dice3D = ({ face, isRolling, onClick, size = 180 }: Props) => {
  const half = size / 2;

  const [rotation, setRotation] = useState(() => {
    const [x, y] = FACE_ANGLES[face] ?? [0, 0];
    return { x, y };
  });
  const prevRolling = useRef(false);
  const prevFace = useRef(face);

  useEffect(() => {
    if (isRolling && !prevRolling.current) {
      const [targetX, targetY] = FACE_ANGLES[face];
      const spinsX = (Math.floor(Math.random() * 3) + 3) * 360;
      const spinsY = (Math.floor(Math.random() * 3) + 3) * 360;
      setRotation({
        x: targetX + spinsX * (Math.random() > 0.5 ? 1 : -1),
        y: targetY + spinsY * (Math.random() > 0.5 ? 1 : -1),
      });
    }
    if (!isRolling && !prevRolling.current && face !== prevFace.current) {
      const [x, y] = FACE_ANGLES[face] ?? [0, 0];
      setRotation({ x, y });
    }
    prevRolling.current = isRolling;
    prevFace.current = face;
  }, [isRolling, face]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRolling}
      aria-label="ทอยลูกเต๋า 3 มิติ"
      className="cursor-pointer border-none bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:cursor-default focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      style={{
        perspective: `${size * 5}px`,
        width: size,
        height: size,
      }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 1.6s cubic-bezier(0.15, 0.8, 0.3, 1)',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <DiceFace dots={DOT_POSITIONS[1]} transform={`translateZ(${half}px)`} isOne />
        <DiceFace dots={DOT_POSITIONS[6]} transform={`rotateY(180deg) translateZ(${half}px)`} />
        <DiceFace dots={DOT_POSITIONS[5]} transform={`rotateY(90deg) translateZ(${half}px)`} />
        <DiceFace dots={DOT_POSITIONS[2]} transform={`rotateY(-90deg) translateZ(${half}px)`} />
        <DiceFace dots={DOT_POSITIONS[3]} transform={`rotateX(90deg) translateZ(${half}px)`} />
        <DiceFace dots={DOT_POSITIONS[4]} transform={`rotateX(-90deg) translateZ(${half}px)`} />
      </div>
    </button>
  );
};

export default Dice3D;
