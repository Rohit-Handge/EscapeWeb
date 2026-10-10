
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ['https://escapeweb.onrender.com/'] }
});

const PORT = process.env.PORT || 3000;
const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const rooms = new Map();



const escapeRooms = [
  {
    name: "The Paradox Hotel",
    icon: "🏨",
    puzzles: [
      {
        title: "M4 — The Impossible Floor",
        difficulty: "Medium",
        story: "The elevator skips every floor whose number contains the digit 3.",
        question: "Starting at floor 1, the elevator visits 1, 2, 4, 5, 6, 7, 8, 9, 10. What is the 13th floor it actually visits?",
        answer: ["16"],
        hint: "Continue counting upward, skipping 3, 13, 23, and every other number containing 3."
      },
      {
        title: "M5 — The Twin Clocks",
        difficulty: "Medium",
        story: "Two clocks strike at different intervals. One strikes every 12 minutes; the other every 18 minutes. They strike together at midnight.",
        question: "After how many minutes will they next strike together?",
        answer: ["36", "36 minutes"],
        hint: "Find the least common multiple of 12 and 18."
      },
      {
        title: "M6 — The Three Doors",
        difficulty: "Medium",
        story: "One door leads outside. Two guards stand nearby. One always lies; one always tells the truth. You may ask one guard one yes-or-no question.",
        question: "What question can you ask to identify the safe door if you know which guard you are speaking to?",
        answer: ["which door would the other guard say is safe", "which door would the liar say is safe"],
        hint: "Ask about what the other guard would say, then choose the opposite door."
      },
      {
        title: "M7 — The Missing Guest",
        difficulty: "Medium",
        story: "A guest disappears from a locked room. The only clue is a note: 2, 6, 12, 20, 30, ?",
        question: "What number belongs in the blank?",
        answer: ["42"],
        hint: "Look at the differences between consecutive numbers."
      },
      {
        title: "H8 — The Prisoner's Choice",
        difficulty: "Hard",
        story: "Three prisoners are told that at least one of them wears a red hat. Each can see the others' hats but not their own. They are asked whether they know their own hat colour. Everyone answers no in the first round. In the second round, the first prisoner says yes.",
        question: "What must be true about the other two hats for this classic reasoning puzzle to work?",
        answer: ["both are red", "the other two are red", "two red hats"],
        hint: "This puzzle requires the prisoners to reason about what the others' silence reveals."
      },
      {
        title: "H9 — The Four-Digit Vault",
        difficulty: "Hard",
        story: "The vault code has four distinct digits. The digits sum to 18. The first digit is twice the last. The second digit is one less than the third. The code is an even number.",
        question: "Can these clues determine one unique code?",
        answer: ["no", "not enough information", "multiple codes"],
        hint: "Try finding more than one code that satisfies every clue."
      },
      {
        title: "H10 — The Hotel's Secret",
        difficulty: "Hard",
        story: "A room number follows this rule: reverse its digits, and the new number is 27 smaller than the original. The two digits add to 9.",
        question: "What is the original two-digit room number?",
        answer: ["63"],
        hint: "Compare 63 and 36."
      },
      {
        title: "H11 — The Time Loop",
        difficulty: "Hard",
        story: "A clock loses 10 minutes every real hour. It is set correctly at noon.",
        question: "When real time reaches 6 PM, what time will the faulty clock show?",
        answer: ["5:00", "5 pm", "17:00", "five pm", "5"],
        hint: "Six real hours pass. The clock loses 10 minutes per hour."
      },
      {
        title: "H12 — The Silent Witness",
        difficulty: "Hard",
        story: "A detective finds three suspects. Exactly one statement is true. Ava says, 'Ben did it.' Ben says, 'I did not do it.' Cara says, 'Ava is lying.'",
        question: "Who committed the crime?",
        answer: ["cara"],
        hint: "Test each suspect and count how many statements become true."
      },
      {
        title: "H13 — The Final Paradox",
        difficulty: "Hard",
        story: "A sign says: 'The statement on the other side of this sign is false.' The other side says: 'The statement on the first side is true.'",
        question: "What is the best logical classification of this pair of statements?",
        answer: ["paradox", "logical paradox", "self referential paradox"],
        hint: "Assume the first statement is true, then assume it is false."
      }
    ]
  },

  {
    name: "The Quantum Abyss",
    icon: "⚛️",
    puzzles: [
      {
        title: "M4 — Reactor Sequence",
        difficulty: "Medium",
        story: "The reactor displays 2, 3, 5, 9, 17, 33, ...",
        question: "What number comes next?",
        answer: ["65"],
        hint: "Each number is double the previous number minus 1."
      },
      {
        title: "M5 — The Probability Chamber",
        difficulty: "Medium",
        story: "A chamber contains 3 red spheres and 2 blue spheres. You draw one sphere at random.",
        question: "What is the probability of drawing a blue sphere, expressed as a percentage?",
        answer: ["40%", "40", "40 percent"],
        hint: "Divide the number of blue spheres by the total number of spheres."
      },
      {
        title: "M6 — The Quantum Switch",
        difficulty: "Medium",
        story: "Three switches are arranged in a row. Each can be ON or OFF.",
        question: "How many different switch configurations exist?",
        answer: ["8", "eight"],
        hint: "Each switch has two possible states."
      },
      {
        title: "M7 — The Energy Equation",
        difficulty: "Medium",
        story: "The reactor follows E = mc². A simplified simulation uses m = 2 and c = 3.",
        question: "What value does the simulation calculate for E?",
        answer: ["18"],
        hint: "Square c before multiplying by m."
      },
      {
        title: "H8 — The Quantum Twins",
        difficulty: "Hard",
        story: "Two sealed boxes contain one gold coin and one silver coin. You choose a box at random, then draw a coin at random.",
        question: "What is the probability of drawing a gold coin?",
        answer: ["1/2", "0.5", "50%", "50", "one half"],
        hint: "Both boxes contain one gold coin and one silver coin."
      },
      {
        title: "H9 — The Reactor Overload",
        difficulty: "Hard",
        story: "A reactor's output doubles every minute. It becomes completely full at minute 60.",
        question: "At what minute was it half full?",
        answer: ["59", "minute 59"],
        hint: "The output doubles between consecutive minutes."
      },
      {
        title: "H10 — The Entanglement Code",
        difficulty: "Hard",
        story: "A four-bit code has exactly two 1s. Its first bit and last bit must differ.",
        question: "How many different codes satisfy both conditions?",
        answer: ["4", "four"],
        hint: "If the first and last bits differ, one is 1 and one is 0. Choose the middle bits to make two 1s total."
      },
      {
        title: "H11 — The Particle Maze",
        difficulty: "Hard",
        story: "A particle moves on a grid from (0,0) to (4,4). It can only move right or up.",
        question: "How many shortest paths can it take?",
        answer: ["70", "seventy"],
        hint: "Every shortest path contains four right moves and four up moves."
      },
      {
        title: "H12 — Schrödinger's Lock",
        difficulty: "Hard",
        story: "A lock accepts a positive integer n. Its display reads n² − n = 42.",
        question: "What is the positive integer n?",
        answer: ["7", "seven"],
        hint: "Find two consecutive integers whose product is 42."
      },
      {
        title: "H13 — The Last Singularity",
        difficulty: "Hard",
        story: "A system starts with 1 cell. Every cell splits into 2 cells each round. No cells die.",
        question: "How many cells exist after 10 rounds?",
        answer: ["1024", "1,024"],
        hint: "Calculate 2 raised to the power of 10."
      }
    ]
  },

  {
    name: "The Blacksite Files",
    icon: "🕵️",
    puzzles: [
      {
        title: "M4 — The Alibi",
        difficulty: "Medium",
        story: "A suspect says he was at home between 8 PM and 9 PM. Security footage places him at a bank at 8:30 PM.",
        question: "What is the strongest conclusion supported by this evidence?",
        answer: ["contradicted", "the alibi is contradicted", "the alibi is false","contadiction","mismatch","contradicts","contradict"],
        hint: "The footage conflicts with his claimed location."
      },
      {
        title: "M5 — The Cipher Note",
        difficulty: "Medium",
        story: "A note uses a Caesar cipher that shifts every letter forward by 3. The encrypted word is KHOOR.",
        question: "What is the original word?",
        answer: ["hello"],
        hint: "Shift each letter backward by 3."
      },
      {
        title: "M6 — The Evidence Locker",
        difficulty: "Medium",
        story: "There are 5 suspects. Each suspect has a unique fingerprint. The evidence matches exactly one fingerprint.",
        question: "How many suspects can be ruled out if the fingerprint identification is reliable?",
        answer: ["4", "four"],
        hint: "One suspect remains; the others do not match."
      },
      {
        title: "M7 — The Missing File",
        difficulty: "Medium",
        story: "A file was accessed on Monday, Wednesday, Friday, and Sunday. The pattern continues every two days.",
        question: "What day is the next access?",
        answer: ["tuesday", "Tuesday"],
        hint: "Move forward by two days from Sunday."
      },
      {
        title: "H8 — The Three Suspects",
        difficulty: "Hard",
        story: "Exactly one of Ava, Ben, and Cara is guilty. Ava says Ben is guilty. Ben says Cara is guilty. Cara says Ben is innocent. Exactly one statement is true.",
        question: "Who is guilty?",
        answer: ["ava"],
        hint: "Test each suspect and count the true statements."
      },
      {
        title: "H9 — The Poisoned Glass",
        difficulty: "Hard",
        story: "A detective has 8 identical-looking vials. One is poisoned. The poison is detectable by a test strip that shows a result after one hour. The detective has only one strip.",
        question: "Can the detective identify the poisoned vial with certainty using only this one test strip?",
        answer: ["no", "no, not with one strip", "impossible"],
        hint: "One strip provides only a single positive or negative result."
      },
      {
        title: "H10 — The Hidden Pattern",
        difficulty: "Hard",
        story: "A coded message replaces each letter with its alphabet position. The code reads 3-18-25-16-20-15.",
        question: "What word does the code spell?",
        answer: ["crypto"],
        hint: "A=1, B=2, C=3, and so on."
      },
      {
        title: "H11 — The Locked Archive",
        difficulty: "Hard",
        story: "A safe uses a three-digit code. The digits are distinct. Their sum is 12. The hundreds digit is twice the units digit. The tens digit is 2 greater than the units digit.",
        question: "What is the code?",
        answer: ["642"],
        hint: "Let the units digit be x. Then the digits are 2x, x+2, and x."
      },
      {
        title: "H12 — The Insider",
        difficulty: "Hard",
        story: "A log records 4 events: login, file download, privilege escalation, logout. One event occurred out of order, but the download must happen after login and privilege escalation must happen before logout.",
        question: "Can you determine the exact out-of-order event from these clues alone?",
        answer: ["no", "not enough information", "undetermined"],
        hint: "More than one event order may satisfy these constraints."
      },
      {
        title: "H13 — Case Zero",
        difficulty: "Hard",
        story: "A detective sees a one-way mirror, a broken clock, and a wet floor. The clock stopped at 9:15, but no witness saw the crime.",
        question: "Which single clue proves the exact time the crime occurred?",
        answer: ["none", "no clue", "none of them", "no single clue"],
        hint: "A stopped clock or wet floor may suggest something, but does not prove an exact time."
      }
    ]
  },

  {
    name: "The Forbidden Temple",
    icon: "🗿",
    puzzles: [
      {
        title: "M4 — The Stone Sequence",
        difficulty: "Medium",
        story: "Ancient stones show 1, 8, 27, 64, 125, ...",
        question: "What number comes next?",
        answer: ["216"],
        hint: "These are cubes of consecutive positive integers."
      },
      {
        title: "M5 — The Sand Timer",
        difficulty: "Medium",
        story: "A 7-minute timer and an 11-minute timer start together.",
        question: "How many minutes pass before both timers finish together for the first time?",
        answer: ["77", "77 minutes"],
        hint: "Find the least common multiple of 7 and 11."
      },
      {
        title: "M6 — The Sacred Balance",
        difficulty: "Medium",
        story: "Three identical stones and a 2 kg weight balance a 14 kg weight.",
        question: "What is the mass of one stone?",
        answer: ["4 kg", "4kg", "4", "4 kilograms"],
        hint: "Three stones together weigh 12 kg."
      },
      {
        title: "M7 — The Temple's Shadow",
        difficulty: "Medium",
        story: "A 2-metre pole casts a 3-metre shadow. At the same time, a temple casts a 24-metre shadow.",
        question: "How tall is the temple, assuming the ground is level and the sun angle is the same?",
        answer: ["16 m", "16m", "16", "16 metres", "16 meters"],
        hint: "Use the ratio of height to shadow length."
      },
      {
        title: "H8 — The Bridge of Truth",
        difficulty: "Hard",
        story: "Two paths lead from the temple. One is safe and one is trapped. Two guardians know the paths; one always lies and one always tells the truth. You can ask one yes-or-no question to either guardian.",
        question: "What strategy guarantees you identify the safe path?",
        answer: ["ask what the other guardian would say and choose the opposite", "ask what the other guard would say then take the opposite", "ask the other guard's answer and choose the opposite"],
        hint: "The liar's lie and the truth-teller's report both point you toward the wrong path."
      },
      {
        title: "H9 — The Golden Ratio",
        difficulty: "Hard",
        story: "A sequence begins 1, 1, 2, 3, 5, 8, 13, ...",
        question: "What is the first term in this sequence that is greater than 100?",
        answer: ["144"],
        hint: "Each term is the sum of the previous two."
      },
      {
        title: "H10 — The Four Torches",
        difficulty: "Hard",
        story: "Four explorers must cross a bridge at night. They take 1, 2, 7, and 10 minutes respectively. Only two can cross at once, they need one torch, and a pair moves at the slower person's speed.",
        question: "What is the minimum total time for all four to cross?",
        answer: ["17", "17 minutes"],
        hint: "Send the two fastest strategically so the slowest two do not each require the fastest explorer to escort them separately."
      },
      {
        title: "H11 — The Royal Seal",
        difficulty: "Hard",
        story: "A square seal has a perimeter of 48 cm.",
        question: "What is the area of the seal in square centimetres?",
        answer: ["144", "144 cm2", "144 cm^2"],
        hint: "Find the side length first."
      },
      {
        title: "H12 — The Hidden Chamber",
        difficulty: "Hard",
        story: "A chamber contains 100 numbered stones, from 1 to 100. Every stone divisible by 2 is painted red, every stone divisible by 3 is painted blue, and stones divisible by both are painted purple.",
        question: "How many stones are painted purple?",
        answer: ["16", "sixteen"],
        hint: "Count the multiples of 6 from 1 through 100."
      },
      {
        title: "H13 — The Last Guardian",
        difficulty: "Hard",
        story: "The guardian gives you this puzzle: 'I am a three-digit number. My hundreds digit is twice my units digit. My tens digit is the sum of my other two digits. All digits are positive.'",
        question: "What is the smallest number that satisfies these conditions?",
        answer: ["312"],
        hint: "Try the smallest positive units digit, then calculate the hundreds and tens digits."
      }
    ]
  }
];

function newCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function publicPuzzle(room, player) {
  const puzzle = room.game.puzzles[player.progress] || null;
  return puzzle ? {
    title: puzzle.title,
    story: puzzle.story,
    question: puzzle.question,
    hint: puzzle.hint,
    number: player.progress + 1
  } : null;
}

function sendState(room) {
  for (const player of room.players.values()) {
    const opponent = [...room.players.values()].find(p => p.id !== player.id);
    io.to(player.id).emit('game-state', {
      code: room.code,
      roomName: room.game.name,
      roomIcon: room.game.icon,
      players: room.players.size,
      started: room.players.size === 2,
      progress: player.progress,
      total: room.game.puzzles.length,
      puzzle: publicPuzzle(room, player),
      opponentProgress: opponent?.progress ?? 0,
      opponentName: opponent?.name ?? 'Waiting for player',
      myName: player.name,
      winnerName: room.winnerName,
      isWinner: room.winnerId === player.id
    });
  }
}

function removePlayer(socket) {
  const code = socket.data.roomCode;
  if (!code) return;
  const room = rooms.get(code);
  if (!room) return;

  room.players.delete(socket.id);
  socket.leave(code);
  socket.data.roomCode = null;

  if (room.players.size === 0) {
    rooms.delete(code);
  } else {
    room.winnerId = null;
    room.winnerName = null;
    sendState(room);
    io.to(code).emit('notice', 'Your opponent disconnected. Waiting for a replacement player.');
  }
}

io.on('connection', socket => {
  socket.on('create-room', ({ name } = {}) => {
    removePlayer(socket);

    let code;
    do { code = newCode(); } while (rooms.has(code));

    const game = escapeRooms[Math.floor(Math.random() * escapeRooms.length)];
    const room = {
      code,
      game,
      players: new Map(),
      winnerId: null,
      winnerName: null
    };

    rooms.set(code, room);
    room.players.set(socket.id, {
      id: socket.id,
      name: String(name || 'Player 1').trim().slice(0, 20) || 'Player 1',
      progress: 0
    });

    socket.join(code);
    socket.data.roomCode = code;
    sendState(room);
  });

  socket.on('join-room', ({ code, name } = {}) => {
    removePlayer(socket);
    code = String(code || '').trim().toUpperCase();
    const room = rooms.get(code);

    if (!room) {
      socket.emit('action-error', 'Room not found. Check the code or create a new room.');
      return;
    }
    if (room.players.size >= 2) {
      socket.emit('action-error', 'This room already has two players.');
      return;
    }

    room.players.set(socket.id, {
      id: socket.id,
      name: String(name || 'Player 2').trim().slice(0, 20) || 'Player 2',
      progress: 0
    });

    socket.join(code);
    socket.data.roomCode = code;
    sendState(room);
    io.to(code).emit('notice', 'Both players are connected. The race begins!');
  });

  socket.on('submit-answer', ({ answer } = {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.players.get(socket.id);
    if (!room || !player || room.players.size !== 2 || room.winnerId) return;

    const puzzle = room.game.puzzles[player.progress];
    if (!puzzle) return;

    const submitted = String(answer || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const correct = puzzle.answer.some(value => value.toLowerCase() === submitted);

    if (!correct) {
      socket.emit('answer-feedback', { correct: false, message: 'Not quite! Recheck the clue and try again.' });
      return;
    }

    player.progress += 1;
    socket.emit('answer-feedback', { correct: true, message: 'Correct! The lock is open.' });

    if (player.progress === room.game.puzzles.length) {
      room.winnerId = player.id;
      room.winnerName = player.name;
    }

    sendState(room);
  });

  socket.on('disconnect', () => removePlayer(socket));
});

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'EscapeWeb Multiplayer' }));
app.use(express.static(dist));

app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) {
    return next();
  }

  if (existsSync(path.join(dist, 'index.html'))) {
    return res.sendFile(path.join(dist, 'index.html'));
  }

  res.status(404).send('Build the frontend with npm run build first.');
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});