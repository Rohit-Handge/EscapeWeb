
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './index.css';
import { useGameAudio } from './useGameAudio';

const socket = io('http://localhost:3000', { autoConnect: false });

export default function App() {
  const [name, setName] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [state, setState] = useState(null);
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const audio = useGameAudio();

  useEffect(() => {
    const onState = data => {
      setState(data);
      setError('');
      setConnecting(false);
    };
    const onError = message => {
      setError(message);
      setConnecting(false);
    };
    const onNotice = message => setNotice(message);
    const onFeedback = data => {
      setFeedback(data);
      if (data.correct) setAnswer('');
    };

    socket.on('game-state', onState);
    socket.on('action-error', onError);
    socket.on('notice', onNotice);
    socket.on('answer-feedback', onFeedback);

    return () => {
      socket.off('game-state', onState);
      socket.off('action-error', onError);
      socket.off('notice', onNotice);
      socket.off('answer-feedback', onFeedback);
    };
  }, []);

  function connect() {
    if (!name.trim()) {
      setError('Enter your player name first.');
      return false;
    }
    setError('');
    setConnecting(true);
    if (!socket.connected) socket.connect();
    return true;
  }

  function createRoom() {
    if (connect()) {
      socket.once('connect', () => socket.emit('create-room', { name: name.trim() }));
      if (socket.connected) socket.emit('create-room', { name: name.trim() });
    }
  }

  function joinRoom() {
    if (!codeInput.trim()) {
      setError('Enter the room code from your friend.');
      return;
    }
    if (connect()) {
      socket.once('connect', () => socket.emit('join-room', {
        code: codeInput.trim().toUpperCase(),
        name: name.trim()
      }));
      if (socket.connected) socket.emit('join-room', {
        code: codeInput.trim().toUpperCase(),
        name: name.trim()
      });
    }
  }

  function submitAnswer(event) {
    audio.play('click');
    event.preventDefault();
    if (!answer.trim() || !state?.started || state.winnerName) return;
    setFeedback(null);
    socket.emit('submit-answer', { answer });
  }

  function leaveGame() {
    socket.disconnect();
    setState(null);
    setAnswer('');
    setHint(false);
    setFeedback(null);
    setNotice('');
    setError('');
    setConnecting(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(state.code);
      setNotice('Room code copied! Send it to your friend.');
    } catch {
      setNotice(`Share this room code with your friend: ${state.code}`);
    }
  }

  const complete = state && state.progress >= state.total;

  return (
    <main className="mp-page">
      <header className="mp-header">
        <a className="mp-logo" href="#"><span>Ｅ</span> EscapeWeb</a>
        <span className="mp-tag">MULTIPLAYER ESCAPE RACE</span>
      </header>

      {!state ? (
        <section className="lobby">
          <div className="mp-eyebrow">✦ TWO PLAYERS. ONE ESCAPE.</div>
          <h1>Can you escape<br /><em>before your rival?</em></h1>
          <p className="mp-subtitle">
            Crack the clues, unlock each puzzle and race your friend to the final door.
          </p>

          <div className="lobby-card">
            <label htmlFor="player-name">YOUR PLAYER NAME</label>
            <input
              id="player-name"
              value={name}
              maxLength={20}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
            />

            <button className="mp-primary" onClick={createRoom} disabled={connecting}>
              {connecting ? 'CONNECTING…' : 'CREATE A ROOM'} <span>↗</span>
            </button>

            <div className="mp-or">OR JOIN A FRIEND</div>

            <label htmlFor="room-code">ROOM CODE</label>
            <input
              id="room-code"
              className="code-input"
              value={codeInput}
              maxLength={6}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="E.G. K7PQ2M"
            />

            <button className="mp-secondary" onClick={joinRoom} disabled={connecting}>
              JOIN ROOM
            </button>

            {error && <p className="mp-error">{error}</p>}
            {notice && <p className="mp-notice">{notice}</p>}
          </div>

          <div className="mp-feature-row">
            <span>🔐 Shared escape room</span>
            <span>⚡ Live race progress</span>
            <span>🏆 First to escape wins</span>
          </div>
        </section>
      ) : (
        <><section className="match-layout">
            <div className="match-top">
              <div>
                <div className="mp-eyebrow">✦ MULTIPLAYER MISSION</div>
                <h1>{state.roomIcon} {state.roomName}</h1>
                <p className="mp-subtitle">
                  {state.started
                    ? 'The race is on. Solve your puzzles as quickly as you can.'
                    : 'Waiting for your friend to join the room…'}
                </p>
              </div>
              <div className="room-code-card">
                <span>ROOM CODE</span>
                <strong>{state.code}</strong>
                <button onClick={copyCode}>COPY CODE</button>
              </div>
            </div>

            {notice && <div className="mp-notice banner">{notice}</div>}

            <div className="race-grid">
              <div className="race-player">
                <div className="player-head">
                  <span className="player-avatar">YOU</span>
                  <div><strong>{state.myName}</strong><small>Your progress</small></div>
                </div>
                <div className="race-track">
                  <div style={{ width: `${state.progress / state.total * 100}%` }} />
                </div>
                <div className="race-score"><strong>{state.progress}/{state.total}</strong><span>PUZZLES SOLVED</span></div>
              </div>

              <div className="race-player opponent">
                <div className="player-head">
                  <span className="player-avatar">VS</span>
                  <div>
                    <strong>{state.opponentName}</strong>
                    <small>{state.players < 2 ? 'Not connected yet' : 'Opponent progress'}</small>
                  </div>
                </div>
                <div className="race-track">
                  <div style={{ width: `${state.opponentProgress / state.total * 100}%` }} />
                </div>
                <div className="race-score"><strong>{state.opponentProgress}/{state.total}</strong><span>PUZZLES SOLVED</span></div>
              </div>
            </div>

            {state.winnerName ? (
              <div className="mp-puzzle victory-card">
                <div className="mp-trophy">{state.isWinner ? '🏆' : '🏁'}</div>
                <div className="mp-eyebrow">✦ RACE FINISHED</div>
                <h2>{state.isWinner ? 'You escaped first!' : `${state.winnerName} escaped first!`}</h2>
                <p>{state.isWinner ? 'Brilliant work. You beat your rival to the final door.' : 'Your rival unlocked the final door before you.'}</p>
                <button className="mp-primary" onClick={leaveGame}>BACK TO LOBBY ↗</button>
              </div>
            ) : !state.started ? (
              <div className="mp-puzzle waiting-card">
                <div className="waiting-icon">⌛</div>
                <h2>Your room is ready</h2>
                <p>Share the code with one friend. The race begins as soon as they join.</p>
                <button className="mp-secondary" onClick={copyCode}>COPY INVITE CODE</button>
              </div>
            ) : complete ? (
              <div className="mp-puzzle waiting-card">
                <div className="waiting-icon">🔓</div>
                <h2>All your locks are open!</h2>
                <p>You solved every puzzle. Waiting for the server to confirm the race result.</p>
              </div>
            ) : (
              <div className="mp-puzzle">
                <div className="puzzle-topline">
                  <span>PUZZLE {String(state.puzzle.number).padStart(2, '0')} OF {state.total}</span>
                  <span>🔒 LOCKED</span>
                </div>
                <h2>{state.puzzle.title}</h2>
                <p className="puzzle-story">{state.puzzle.story}</p>
                <div className="mp-clue">
                  <span>✧</span>
                  <div><strong>YOUR CLUE</strong><p>{state.puzzle.question}</p></div>
                </div>

                <form className="mp-answer-form" onSubmit={submitAnswer}>
                  <label htmlFor="puzzle-answer">YOUR ANSWER</label>
                  <div>
                    <input
                      id="puzzle-answer"
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder="Type your answer…"
                      autoComplete="off"
                      maxLength={100} />
                    <button className="mp-primary" disabled={!answer.trim()}>UNLOCK ↗</button>
                  </div>
                </form>

                {feedback && (
                  <p className={feedback.correct ? 'mp-success' : 'mp-error'}>
                    {feedback.message}
                  </p>
                )}

                <button className="mp-hint" onClick={() => setHint(v => !v)}>
                  ✦ {hint ? 'Hide hint' : 'Need a hint?'} <span>{hint ? '−' : '+'}</span>
                </button>
                {hint && <div className="mp-hint-box">💡 {state.puzzle.hint}</div>}
              </div>
            )}

            <button className="leave-button" onClick={leaveGame}>← LEAVE GAME</button>
          </section>
          <div className="audio-controls">
              <button onClick={() => audio.toggleMute()}>
                {audio.muted ? '🔇 Sound Off' : '🔊 Sound On'}
              </button>

              <button
                onClick={() => {
                  audio.startAmbience();
                  audio.play('unlock');
                } }
              >
                ▶ Enable Room Audio
              </button>
            </div></> 
      )}

      <footer className="mp-footer">ESCAPEWEB <span>THINK · SOLVE · ESCAPE</span></footer>
    </main>
  );
}