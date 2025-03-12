import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const POMODORO_TIME = 1 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

// 모달 컴포넌트
interface FocusScoreModalProps {
  onClose: () => void;
  onSubmit: (score: number) => void;
}

function FocusScoreModal({ onClose, onSubmit }: FocusScoreModalProps) {
  const [score, setScore] = useState<number>(3); // 기본값 3점으로 설정

  const handleSubmit = () => {
    onSubmit(score);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(e.target.value), 1), 5); // 1~5 범위로 제한
    setScore(value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>집중도 점수 입력</h2>
        <input
          type="number"
          value={score}
          onChange={handleChange}
          min="1"
          max="5"
          placeholder="1 ~ 5점"
        />
        <button type="button" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}

export default function PomodoroTimer() {
  const [time, setTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusScore, setFocusScore] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      clearInterval(timer);
      setIsRunning(false);
      if (!isBreak) {
        setIsModalOpen(true); // 타이머가 끝나면 모달 열기
        setIsBreak(true);
        setTime(BREAK_TIME);
        setIsRunning(true);
      } else {
        setIsBreak(false);
        setTime(POMODORO_TIME);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isBreak]);

  const handleFocusScoreSubmit = (score: number) => {
    setFocusScore(score);
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="pomodoro-container">
      <h1 className="title">{isBreak ? '휴식 시간' : '포모도로 타이머'}</h1>
      <p className="timer">
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
      </p>
      <button
        type="button"
        className="button"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? '일시정지' : '시작'}
      </button>
      <button
        type="button"
        className="button reset"
        onClick={() => {
          setIsRunning(false);
          setTime(POMODORO_TIME);
        }}
      >
        리셋
      </button>
      {focusScore && <p className="score">지난 세션 집중도: {focusScore}점</p>}

      {isModalOpen && (
        <FocusScoreModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFocusScoreSubmit}
        />
      )}
    </div>
  );
}
