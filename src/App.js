/* eslint-disable no-new-func */
import React, { useState, useEffect } from 'react';
import { Code, Check, X, Star, Trophy, ArrowRight, Zap, Heart, Volume2, VolumeX, RotateCcw } from 'lucide-react';

const CodeQuestGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [stars, setStars] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [lives, setLives] = useState(3);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [attempts, setAttempts] = useState({});
  const [showParticles, setShowParticles] = useState(false);
  const [streak, setStreak] = useState(0);

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'success') {
        oscillator.frequency.value = 523.25;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else if (type === 'error') {
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (e) {
      // Silently fail if audio isn't supported
    }
  };

  const achievementList = [
    { id: 'first_win', name: 'First Steps', icon: '🎯' },
    { id: 'perfectionist', name: 'Perfectionist', icon: '💎' },
    { id: 'speedrunner', name: 'Speed Demon', icon: '⚡' },
    { id: 'halfway', name: 'Halfway Hero', icon: '🎖️' },
    { id: 'completionist', name: 'Code Master', icon: '👑' },
    { id: 'streak_3', name: 'Hot Streak', icon: '🔥' },
  ];

  const unlockAchievement = (id) => {
    if (!achievements.includes(id)) {
      setAchievements([...achievements, id]);
      const achievement = achievementList.find(a => a.id === id);
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('codequest_progress') || '{}');
    if (saved.completedLevels) setCompletedLevels(saved.completedLevels);
    if (saved.stars) setStars(saved.stars);
    if (saved.currentLevel !== undefined) setCurrentLevel(saved.currentLevel);
    if (saved.achievements) setAchievements(saved.achievements);
    if (saved.attempts) setAttempts(saved.attempts);
  }, []);

  useEffect(() => {
    localStorage.setItem('codequest_progress', JSON.stringify({
      completedLevels, stars, currentLevel, achievements, attempts
    }));
  }, [completedLevels, stars, currentLevel, achievements, attempts]);

  const levels = [
    {
      id: 0,
      title: "Hello, World!",
      difficulty: "Easy",
      description: "Make the robot say hello! Use console.log() to print a message.",
      starter: "// Type your code here\nconsole.log(",
      hint: "Try: console.log('Hello, World!')",
      challenge: "Print 'Hello, World!' to the console",
      explanation: "🎓 You learned about console.log()! This is how we display messages. Think of it like making your program talk to you.",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return logged.some(l => l.toLowerCase().includes('hello'));
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 1,
      title: "Math Wizard",
      difficulty: "Easy",
      description: "Help the robot calculate! Make it add 5 + 3.",
      starter: "// Calculate 5 + 3\nconst result = ",
      hint: "Use the + operator: const result = 5 + 3; console.log(result);",
      challenge: "Calculate 5 + 3 and print the result",
      explanation: "🎓 You learned about math operators! Computers are super-fast calculators. Use +, -, *, and / to do math.",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return logged.some(l => l.includes('8'));
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 2,
      title: "Variable Valley",
      difficulty: "Easy",
      description: "Store your name in a variable and greet yourself!",
      starter: "// Create a variable with your name\nconst name = ",
      hint: "const name = 'Your Name'; console.log('Hi ' + name);",
      challenge: "Create a variable and print a greeting",
      explanation: "🎓 Variables are like labeled boxes that store information. You can use them later in your code!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return code.includes('const') && code.includes('name') && logged.length > 0;
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 3,
      title: "Loop Canyon",
      difficulty: "Medium",
      description: "Use a for loop to count from 1 to 5!",
      starter: "// Count from 1 to 5\nfor (let i = 1; ",
      hint: "for (let i = 1; i <= 5; i++) { console.log(i); }",
      challenge: "Use a for loop to print numbers 1-5",
      explanation: "🎓 Loops let you repeat actions without writing the same code over and over. Super powerful!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          const nums = logged.join(' ');
          return ['1', '2', '3', '4', '5'].every(n => nums.includes(n));
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 4,
      title: "Function Fortress",
      difficulty: "Medium",
      description: "Create a function that doubles any number!",
      starter: "// Create a function called double\nfunction double(num) {\n  ",
      hint: "function double(num) { return num * 2; } console.log(double(4));",
      challenge: "Create a function that doubles a number",
      explanation: "🎓 Functions are reusable code blocks. Give them inputs and get outputs. Like mini-programs!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code + '\nconsole.log(double(4));');
          func({ log: mockLog });
          return logged.some(l => l.includes('8'));
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 5,
      title: "Condition Castle",
      difficulty: "Medium",
      description: "Use an if statement to check if a number is greater than 10!",
      starter: "// Check if number > 10\nconst num = 15;\nif (",
      hint: "const num = 15; if (num > 10) { console.log('Big number!'); }",
      challenge: "Use an if statement",
      explanation: "🎓 If statements let programs make decisions. This is how they become smart!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return code.includes('if') && logged.length > 0;
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 6,
      title: "Array Adventure",
      difficulty: "Medium",
      description: "Create an array of 3 colors and print each!",
      starter: "// Create array of colors\nconst colors = ",
      hint: "const colors = ['red', 'blue', 'green']; colors.forEach(c => console.log(c));",
      challenge: "Create an array and loop through it",
      explanation: "🎓 Arrays are lists that hold multiple values. Perfect for storing collections!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return code.includes('[') && logged.length >= 2;
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 7,
      title: "String Sorcery",
      difficulty: "Medium",
      description: "Combine two strings and make them uppercase!",
      starter: "// Combine and uppercase\nconst first = 'code';\nconst second = 'quest';\n",
      hint: "const result = (first + second).toUpperCase(); console.log(result);",
      challenge: "Combine strings and convert to uppercase",
      explanation: "🎓 String methods like .toUpperCase() let you transform text in many ways!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return logged.some(l => l.includes('CODEQUEST'));
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 8,
      title: "Object Oasis",
      difficulty: "Hard",
      description: "Create an object with name and age properties!",
      starter: "// Create a person object\nconst person = {\n  ",
      hint: "const person = { name: 'Alex', age: 12 }; console.log(person.name);",
      challenge: "Create an object with properties",
      explanation: "🎓 Objects store related data together using key-value pairs. Essential for organizing data!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          return code.includes('{') && code.includes(':') && logged.length > 0;
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 9,
      title: "While Loop Wilderness",
      difficulty: "Hard",
      description: "Use a while loop to count down from 5 to 1!",
      starter: "// Countdown from 5\nlet count = 5;\nwhile (",
      hint: "let count = 5; while (count > 0) { console.log(count); count--; }",
      challenge: "Create a countdown with while loop",
      explanation: "🎓 While loops run as long as a condition is true. Great for unknown iterations!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          const output = logged.join(' ');
          return code.includes('while') && ['5', '4', '3', '2', '1'].every(n => output.includes(n));
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 10,
      title: "Array Methods",
      difficulty: "Hard",
      description: "Use .filter() to get only even numbers!",
      starter: "// Filter even numbers\nconst numbers = [1,2,3,4,5,6];\nconst evens = ",
      hint: "const evens = numbers.filter(n => n % 2 === 0); console.log(evens);",
      challenge: "Use filter() to get even numbers",
      explanation: "🎓 Array methods like .filter() make data manipulation easy and powerful!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          const output = logged.join(' ');
          return code.includes('filter') && output.includes('2') && output.includes('4');
        } catch (e) {
          return false;
        }
      }
    },
    {
      id: 11,
      title: "FizzBuzz Boss",
      difficulty: "Hard",
      description: "Print 1-10, but Fizz for multiples of 3!",
      starter: "// FizzBuzz challenge\nfor (let i = 1; i <= 10; i++) {\n  ",
      hint: "for (let i = 1; i <= 10; i++) { if (i % 3 === 0) { console.log('Fizz'); } else { console.log(i); } }",
      challenge: "Create mini FizzBuzz",
      explanation: "🎓 You combined loops and conditionals! This is a classic programming challenge. You think like a coder now!",
      test: (code) => {
        try {
          let logged = [];
          const mockLog = (...args) => logged.push(args.join(' '));
          const func = new Function('console', code);
          func({ log: mockLog });
          const output = logged.join(' ');
          return output.includes('Fizz') && output.includes('1');
        } catch (e) {
          return false;
        }
      }
    },
  ];

  const runCode = () => {
    const levelId = currentLevel;
    const currentAttempts = attempts[levelId] || 0;
    
    try {
      let logged = [];
      const mockLog = (...args) => logged.push(args.join(' '));
      const func = new Function('console', userCode);
      func({ log: mockLog });
      
      setOutput(logged.join('\n') || 'No output');
      
      if (levels[currentLevel].test(userCode)) {
        const wasAlreadyCompleted = completedLevels.includes(currentLevel);
        
        if (!wasAlreadyCompleted) {
          setCompletedLevels([...completedLevels, currentLevel]);
          setStars(stars + 10);
          setJustCompleted(true);
          setShowExplanation(true);
          setShowParticles(true);
          setStreak(streak + 1);
          playSound('success');
          
          setTimeout(() => setShowParticles(false), 3000);
          
          if (completedLevels.length === 0) unlockAchievement('first_win');
          if (currentAttempts === 0) unlockAchievement('perfectionist');
          if (completedLevels.length + 1 >= levels.length / 2) unlockAchievement('halfway');
          if (completedLevels.length + 1 === levels.length) unlockAchievement('completionist');
          if (streak + 1 >= 3) unlockAchievement('streak_3');
        }
        
        setOutput(prev => prev + '\n\n✅ Level Complete!' + (!wasAlreadyCompleted ? ' +10 stars' : ''));
      } else {
        setAttempts({...attempts, [levelId]: currentAttempts + 1});
        setLives(Math.max(0, lives - 1));
        playSound('error');
        
        if (lives <= 1) {
          setOutput(prev => prev + '\n\n❌ Out of lives! Restarting...');
          setTimeout(() => {
            setLives(3);
            setUserCode(levels[currentLevel].starter);
          }, 1500);
        }
      }
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
      playSound('error');
      setAttempts({...attempts, [levelId]: currentAttempts + 1});
      setLives(Math.max(0, lives - 1));
    }
  };

  useEffect(() => {
    setUserCode(levels[currentLevel].starter);
    setOutput('');
    setShowHint(false);
    setShowExplanation(false);
    setJustCompleted(false);
    setLives(3);
  }, [currentLevel]);

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'text-green-400 bg-green-900';
    if (diff === 'Medium') return 'text-yellow-400 bg-yellow-900';
    return 'text-red-400 bg-red-900';
  };

  const Particles = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="absolute animate-ping" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${1 + Math.random()}s`,
        }}>
          {['⭐', '✨', '🎉'][Math.floor(Math.random() * 3)]}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 font-mono">
      {showParticles && <Particles />}
      
      {showAchievement && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-lg shadow-2xl border-4 border-white">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{showAchievement.icon}</span>
              <div>
                <div className="font-bold text-lg">Achievement!</div>
                <div className="text-sm">{showAchievement.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-black bg-opacity-50 border-4 border-yellow-400 rounded-lg p-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Code className="text-yellow-400 animate-pulse" size={32} />
              <h1 className="text-3xl font-bold text-white">CodeQuest</h1>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-red-900 bg-opacity-50 px-3 py-2 rounded-lg border-2 border-red-500">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} size={20} className={i < lives ? 'text-red-500' : 'text-gray-600'} fill={i < lives ? 'currentColor' : 'none'} />
                ))}
              </div>

              {streak > 0 && (
                <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-lg font-bold">
                  <Zap fill="currentColor" size={20} />
                  <span>{streak}x</span>
                </div>
              )}

              <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold">
                <Star fill="currentColor" size={20} />
                <span>{stars}</span>
              </div>

              <div className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg font-bold">
                <Trophy size={20} />
                <span>{achievements.length}/{achievementList.length}</span>
              </div>

              <button onClick={() => setSoundEnabled(!soundEnabled)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <div className="text-white text-sm bg-indigo-900 px-3 py-2 rounded-lg">
                Level {currentLevel + 1}/{levels.length}
              </div>

              <button onClick={() => {
                if (window.confirm('Reset all progress?')) {
                  localStorage.removeItem('codequest_progress');
                  setCompletedLevels([]);
                  setStars(0);
                  setCurrentLevel(0);
                  setAchievements([]);
                  setAttempts({});
                  setStreak(0);
                }
              }} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black bg-opacity-50 border-4 border-cyan-400 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold text-white">{levels[currentLevel].title}</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(levels[currentLevel].difficulty)}`}>
                {levels[currentLevel].difficulty}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{levels[currentLevel].description}</p>
            <div className="bg-cyan-900 bg-opacity-30 border-2 border-cyan-400 rounded p-3">
              <p className="text-cyan-300 text-sm font-bold">MISSION:</p>
              <p className="text-white">{levels[currentLevel].challenge}</p>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowHint(!showHint)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                {showHint ? 'Hide Hint' : '💡 Hint?'}
              </button>
              <button onClick={() => { setUserCode(levels[currentLevel].starter); setOutput(''); }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">
                <RotateCcw size={20} />
              </button>
            </div>
            
            {showHint && (
              <div className="mt-3 bg-purple-900 bg-opacity-50 border-2 border-purple-400 rounded p-3">
                <p className="text-purple-300 text-sm">{levels[currentLevel].hint}</p>
              </div>
            )}

            {showExplanation && (
              <div className="mt-3 bg-green-900 bg-opacity-50 border-2 border-green-400 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-green-400 font-bold">What You Learned</h4>
                  <button onClick={() => setShowExplanation(false)} className="text-green-400">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-green-200 text-sm">{levels[currentLevel].explanation}</p>
                {justCompleted && currentLevel < levels.length - 1 && (
                  <button onClick={() => setCurrentLevel(currentLevel + 1)} className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full font-bold flex items-center justify-center gap-2">
                    Next Level <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-black bg-opacity-50 border-4 border-green-400 rounded-lg p-4">
            <h3 className="text-green-400 font-bold mb-3">Level Map</h3>
            <div className="grid grid-cols-4 gap-2">
              {levels.map((level, idx) => (
                <button key={idx} onClick={() => setCurrentLevel(idx)} disabled={idx > 0 && !completedLevels.includes(idx - 1)}
                  className={`p-2 rounded text-sm font-bold ${
                    completedLevels.includes(idx) ? 'bg-green-500 text-white' :
                    idx === currentLevel ? 'bg-yellow-400 text-black' :
                    idx > 0 && !completedLevels.includes(idx - 1) ? 'bg-gray-700 text-gray-500' :
                    'bg-gray-600 text-white hover:bg-gray-500'
                  }`}>
                  {completedLevels.includes(idx) ? <Check size={16} /> : idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black bg-opacity-50 border-4 border-pink-400 rounded-lg p-4">
            <h3 className="text-pink-400 font-bold mb-3">Code Editor</h3>
            <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-64 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm border-2 border-gray-700 focus:border-pink-400 focus:outline-none"
              spellCheck={false} />
            <button onClick={runCode} className="mt-3 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold w-full flex items-center justify-center gap-2">
              <ArrowRight size={20} /> Run Code
            </button>
          </div>

          <div className="bg-black bg-opacity-50 border-4 border-orange-400 rounded-lg p-4">
            <h3 className="text-orange-400 font-bold mb-3">Output Console</h3>
            <div className="bg-gray-900 text-gray-300 p-4 rounded min-h-32 font-mono text-sm whitespace-pre-wrap border-2 border-gray-700">
              {output || 'Click "Run Code" to see output...'}
            </div>
          </div>
        </div>
      </div>

      {completedLevels.length === levels.length && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-lg text-center border-4 border-white max-w-md">
            <Trophy size={64} className="mx-auto mb-4 text-white" />
            <h2 className="text-4xl font-bold text-white mb-4">YOU WIN!</h2>
            <p className="text-white text-lg mb-4">All levels complete! Total stars: {stars} 🎉</p>
            <button onClick={() => { setCompletedLevels([]); setCurrentLevel(0); setStars(0); }}
              className="bg-white text-orange-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeQuestGame;