import React, { useState, useEffect } from 'react';
import './App.css';

const NarutoGame = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [character, setCharacter] = useState({
    name: '',
    clan: '',
    village: '',
    level: 1,
    xp: 0,
    xpToNext: 100,
    rank: 'Academy Student',
    stats: {
      strength: 10,
      speed: 10,
      chakra: 10,
      intelligence: 10,
      stamina: 10
    },
    combat: {
      hp: 100,
      maxHp: 100,
      chakraPoints: 50,
      maxChakra: 50
    },
    jutsu: [],
    inventory: [],
    completedMissions: [],
    pointsRemaining: 25,
    money: 100
  });
  const [battleState, setBattleState] = useState(null);
  const [currentMission, setCurrentMission] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasLoadedCharacter, setHasLoadedCharacter] = useState(false);

  const clans = [
    { 
      name: 'Uchiha', 
      bonus: 'chakra', 
      description: 'Masters of fire jutsu and Sharingan wielders with legendary visual prowess', 
      jutsu: ['Fireball Jutsu', 'Phoenix Flower Jutsu', 'Dragon Fire Technique'],
      advanced: ['Chidori', 'Amaterasu', 'Susanoo'],
      icon: '🔥'
    },
    { 
      name: 'Hyuga', 
      bonus: 'speed', 
      description: 'Gentle Fist masters with Byakugan, seeing through all deceptions', 
      jutsu: ['Gentle Fist', 'Eight Trigrams Palm', 'Byakugan'],
      advanced: ['Eight Trigrams 64 Palms', 'Rotation', 'Air Palm'],
      icon: '👁️'
    },
    { 
      name: 'Uzumaki', 
      bonus: 'stamina', 
      description: 'Possessors of massive chakra reserves and ancient sealing jutsu', 
      jutsu: ['Shadow Clone Jutsu', 'Sealing Technique', 'Chakra Chains'],
      advanced: ['Multiple Shadow Clones', 'Four Symbols Seal', 'Adamantine Chains'],
      icon: '🌀'
    },
    { 
      name: 'Nara', 
      bonus: 'intelligence', 
      description: 'Strategic geniuses who manipulate shadows and think 200 moves ahead', 
      jutsu: ['Shadow Bind', 'Shadow Imitation', 'Shadow Neck Bind'],
      advanced: ['Shadow Sewing', 'Shadow Gathering', 'Shadow Shadow Technique'],
      icon: '🌑'
    },
    { 
      name: 'Akimichi', 
      bonus: 'strength', 
      description: 'Size manipulation masters with immense physical power and appetite', 
      jutsu: ['Expansion Jutsu', 'Human Boulder', 'Partial Expansion'],
      advanced: ['Super Expansion', 'Butterfly Mode', 'Calorie Control'],
      icon: '💪'
    },
    { 
      name: 'Inuzuka', 
      bonus: 'speed', 
      description: 'Beast-like fighters with canine partners and feral instincts', 
      jutsu: ['Fang Over Fang', 'Beast Clone', 'Four Legs Technique'],
      advanced: ['Two-Headed Wolf', 'Tunneling Fang', 'Wolf Fang Over Fang'],
      icon: '🐺'
    }
  ];

  const villages = [
    { name: 'Konohagakure', symbol: '🍃', description: 'Village Hidden in the Leaves - The Will of Fire burns eternal' },
    { name: 'Sunagakure', symbol: '🏜️', description: 'Village Hidden in the Sand - Masters of desert warfare' },
    { name: 'Kirigakure', symbol: '🌊', description: 'Village Hidden in the Mist - Silent assassins of the water' },
    { name: 'Kumogakure', symbol: '⛈️', description: 'Village Hidden in the Clouds - Lightning fast and powerful' },
    { name: 'Iwagakure', symbol: '🗻', description: 'Village Hidden in the Rocks - Unwavering as stone itself' }
  ];

  const jutsuDatabase = {
    basic: [
      { name: 'Basic Punch', damage: 15, cost: 0, type: 'taijutsu' },
      { name: 'Basic Kick', damage: 18, cost: 0, type: 'taijutsu' },
      { name: 'Shuriken Throw', damage: 12, cost: 5, type: 'ninjutsu' },
      { name: 'Substitution Jutsu', damage: 0, cost: 10, type: 'ninjutsu', effect: 'dodge' }
    ],
    clan: {
      Uchiha: [
        { name: 'Fireball Jutsu', damage: 35, cost: 20, type: 'ninjutsu' },
        { name: 'Phoenix Flower Jutsu', damage: 25, cost: 15, type: 'ninjutsu' },
        { name: 'Chidori', damage: 60, cost: 40, type: 'ninjutsu', levelReq: 10 }
      ],
      Hyuga: [
        { name: 'Gentle Fist', damage: 30, cost: 15, type: 'taijutsu' },
        { name: 'Eight Trigrams Palm', damage: 40, cost: 25, type: 'taijutsu' },
        { name: 'Rotation', damage: 20, cost: 30, type: 'taijutsu', effect: 'defense' }
      ],
      Uzumaki: [
        { name: 'Shadow Clone Jutsu', damage: 20, cost: 25, type: 'ninjutsu', effect: 'multi' },
        { name: 'Chakra Chains', damage: 35, cost: 30, type: 'ninjutsu' },
        { name: 'Multiple Shadow Clones', damage: 45, cost: 50, type: 'ninjutsu', levelReq: 8 }
      ],
      Nara: [
        { name: 'Shadow Bind', damage: 15, cost: 20, type: 'ninjutsu', effect: 'stun' },
        { name: 'Shadow Imitation', damage: 25, cost: 25, type: 'ninjutsu' },
        { name: 'Shadow Sewing', damage: 40, cost: 35, type: 'ninjutsu', levelReq: 12 }
      ],
      Akimichi: [
        { name: 'Expansion Jutsu', damage: 40, cost: 20, type: 'taijutsu' },
        { name: 'Human Boulder', damage: 50, cost: 30, type: 'taijutsu' },
        { name: 'Super Expansion', damage: 70, cost: 45, type: 'taijutsu', levelReq: 15 }
      ],
      Inuzuka: [
        { name: 'Fang Over Fang', damage: 35, cost: 20, type: 'taijutsu' },
        { name: 'Four Legs Technique', damage: 25, cost: 15, type: 'taijutsu' },
        { name: 'Two-Headed Wolf', damage: 55, cost: 40, type: 'taijutsu', levelReq: 18 }
      ]
    }
  };

  const enemies = [
    { name: 'Bandit', hp: 80, maxHp: 80, chakra: 30, strength: 12, speed: 10, level: 1, xpReward: 25, moneyReward: 50 },
    { name: 'Rogue Ninja', hp: 120, maxHp: 120, chakra: 50, strength: 18, speed: 15, level: 3, xpReward: 45, moneyReward: 80 },
    { name: 'Wild Beast', hp: 100, maxHp: 100, chakra: 20, strength: 20, speed: 18, level: 2, xpReward: 35, moneyReward: 30 },
    { name: 'Enemy Chunin', hp: 150, maxHp: 150, chakra: 80, strength: 25, speed: 22, level: 5, xpReward: 75, moneyReward: 120 },
    { name: 'Missing-nin', hp: 200, maxHp: 200, chakra: 100, strength: 30, speed: 25, level: 8, xpReward: 120, moneyReward: 200 }
  ];

  const missions = [
    {
      id: 1,
      name: 'Find the Lost Cat',
      description: 'A village cat has gone missing. Search the nearby areas and return it safely to its worried owner.',
      difficulty: 'D-Rank',
      xpReward: 50,
      moneyReward: 100,
      type: 'search',
      completed: false
    },
    {
      id: 2,
      name: 'Escort the Merchant',
      description: 'Escort a wealthy merchant safely through bandit-infested roads to the next village.',
      difficulty: 'C-Rank',
      xpReward: 100,
      moneyReward: 200,
      type: 'escort',
      enemyEncounter: true,
      completed: false
    },
    {
      id: 3,
      name: 'Bandits in the Forest',
      description: 'Clear out a group of bandits who have been terrorizing travelers on the main road.',
      difficulty: 'C-Rank',
      xpReward: 150,
      moneyReward: 300,
      type: 'combat',
      enemyEncounter: true,
      completed: false
    },
    {
      id: 4,
      name: 'Retrieve Secret Scroll',
      description: 'A secret jutsu scroll has been stolen by enemy ninja. Infiltrate their hideout and retrieve it.',
      difficulty: 'B-Rank',
      xpReward: 250,
      moneyReward: 500,
      type: 'retrieve',
      enemyEncounter: true,
      completed: false
    },
    {
      id: 5,
      name: 'Training with Sensei',
      description: 'Undergo intensive training with a skilled sensei to improve your combat abilities.',
      difficulty: 'Training',
      xpReward: 75,
      moneyReward: 0,
      type: 'training',
      completed: false
    }
  ];

  const npcs = [
    {
      name: 'Village Elder',
      dialogue: ['Welcome, young ninja!', 'Your village is proud of your progress.', 'Remember, with power comes responsibility.'],
      role: 'elder'
    },
    {
      name: 'Mission Coordinator',
      dialogue: ['Ready for a new mission?', 'Choose wisely - some missions are more dangerous than others.', 'Your rank determines what missions you can take.'],
      role: 'missions'
    },
    {
      name: 'Training Master',
      dialogue: ['Want to improve your skills?', 'Training is the key to becoming stronger.', 'I can teach you new techniques for the right price.'],
      role: 'training'
    },
    {
      name: 'Shop Keeper',
      dialogue: ['Welcome to my shop!', 'I have weapons, scrolls, and healing items.', 'What can I get for you today?'],
      role: 'shop'
    }
  ];

  const getRankByLevel = (level) => {
    if (level < 5) return 'Academy Student';
    if (level < 10) return 'Genin';
    if (level < 20) return 'Chunin';
    if (level < 30) return 'Jonin';
    return 'Kage';
  };

  const getAvailableJutsu = () => {
    const available = [...jutsuDatabase.basic];
    if (character.clan && jutsuDatabase.clan[character.clan]) {
      const clanJutsu = jutsuDatabase.clan[character.clan].filter(
        jutsu => !jutsu.levelReq || character.level >= jutsu.levelReq
      );
      available.push(...clanJutsu);
    }
    return available.filter(jutsu => !character.jutsu.find(known => known.name === jutsu.name));
  };

  const addToLog = (message) => {
    setGameLog(prev => [...prev.slice(-9), message]);
  };

  const gainXP = (amount) => {
    setCharacter(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        addToLog(`🎉 Level up! You are now level ${newLevel}!`);
        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          rank: getRankByLevel(newLevel),
          xpToNext: (newLevel * 100) - newXP,
          combat: {
            ...prev.combat,
            maxHp: prev.combat.maxHp + 20,
            hp: prev.combat.maxHp + 20,
            maxChakra: prev.combat.maxChakra + 10,
            chakraPoints: prev.combat.maxChakra + 10
          }
        };
      }
      
      return {
        ...prev,
        xp: newXP,
        xpToNext: (prev.level * 100) - newXP
      };
    });
  };

  const startBattle = (enemy) => {
    const battleEnemy = { ...enemy, id: Date.now() };
    setBattleState({
      enemy: battleEnemy,
      turn: 'player',
      log: [`A wild ${enemy.name} appears!`],
      playerAction: null,
      enemyAction: null
    });
    setCurrentScreen('battle');
  };

  const executeBattleTurn = (playerJutsu) => {
    setBattleState(prev => {
      const newLog = [...prev.log];
      let newEnemy = { ...prev.enemy };
      let newCharacter = { ...character };

      if (playerJutsu) {
        const damage = Math.floor(playerJutsu.damage * (character.stats.strength / 10));
        newEnemy.hp = Math.max(0, newEnemy.hp - damage);
        newCharacter.combat.chakraPoints = Math.max(0, newCharacter.combat.chakraPoints - playerJutsu.cost);
        newLog.push(`You used ${playerJutsu.name}! Dealt ${damage} damage.`);
      }

      if (newEnemy.hp <= 0) {
        newLog.push(`${newEnemy.name} is defeated!`);
        gainXP(newEnemy.xpReward);
        setCharacter(prev => ({
          ...prev,
          money: prev.money + newEnemy.moneyReward,
          combat: newCharacter.combat
        }));
        setBattleState(null);
        setCurrentScreen('village');
        addToLog(`Victory! Gained ${newEnemy.xpReward} XP and ${newEnemy.moneyReward} ryo.`);
        return null;
      }

      const enemyDamage = Math.floor(newEnemy.strength * (Math.random() * 0.5 + 0.75));
      newCharacter.combat.hp = Math.max(0, newCharacter.combat.hp - enemyDamage);
      newLog.push(`${newEnemy.name} attacks! You take ${enemyDamage} damage.`);

      if (newCharacter.combat.hp <= 0) {
        newLog.push('You have been defeated...');
        setCharacter(prev => ({
          ...prev,
          combat: { ...prev.combat, hp: 1 }
        }));
        setBattleState(null);
        setCurrentScreen('village');
        addToLog('Defeat... You barely escape with your life.');
        return null;
      }

      setCharacter(prev => ({ ...prev, combat: newCharacter.combat }));

      return {
        ...prev,
        enemy: newEnemy,
        log: newLog,
        turn: 'player'
      };
    });
  };

  const startMission = (mission) => {
    setCurrentMission(mission);
    setCurrentScreen('mission');
    
    if (mission.type === 'training') {
      setTimeout(() => {
        gainXP(mission.xpReward);
        addToLog(`Training complete! Gained ${mission.xpReward} XP.`);
        completeMission(mission);
      }, 2000);
    } else if (mission.enemyEncounter) {
      setTimeout(() => {
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        startBattle(randomEnemy);
      }, 3000);
    } else {
      setTimeout(() => {
        gainXP(mission.xpReward);
        setCharacter(prev => ({ ...prev, money: prev.money + mission.moneyReward }));
        addToLog(`Mission complete! Gained ${mission.xpReward} XP and ${mission.moneyReward} ryo.`);
        completeMission(mission);
      }, 2000);
    }
  };

  const completeMission = (mission) => {
    setCharacter(prev => ({
      ...prev,
      completedMissions: [...prev.completedMissions, mission.id]
    }));
    setCurrentMission(null);
    setCurrentScreen('village');
  };

  const learnJutsu = (jutsu) => {
    const cost = jutsu.levelReq ? jutsu.levelReq * 50 : 100;
    if (character.money >= cost) {
      setCharacter(prev => ({
        ...prev,
        jutsu: [...prev.jutsu, jutsu],
        money: prev.money - cost
      }));
      addToLog(`Learned ${jutsu.name}!`);
    }
  };

  const restoreHealth = () => {
    setCharacter(prev => ({
      ...prev,
      combat: {
        ...prev.combat,
        hp: prev.combat.maxHp,
        chakraPoints: prev.combat.maxChakra
      }
    }));
    addToLog('Health and chakra restored!');
  };

  const typeWriter = (text, callback) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    const timer = setInterval(() => {
      setTypingText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 50);
    return timer;
  };

  const saveCharacter = () => {
    try {
      localStorage.setItem('narutoCharacter', JSON.stringify(character));
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  const loadCharacter = () => {
    try {
      const saved = localStorage.getItem('narutoCharacter');
      if (saved) {
        const loadedChar = JSON.parse(saved);
        // Ensure all required properties exist
        const defaultChar = {
          name: '',
          clan: '',
          village: '',
          level: 1,
          xp: 0,
          xpToNext: 100,
          rank: 'Academy Student',
          stats: {
            strength: 10,
            speed: 10,
            chakra: 10,
            intelligence: 10,
            stamina: 10
          },
          combat: {
            hp: 100,
            maxHp: 100,
            chakraPoints: 50,
            maxChakra: 50
          },
          jutsu: [],
          inventory: [],
          completedMissions: [],
          pointsRemaining: 25,
          money: 100
        };
        
        const mergedChar = { ...defaultChar, ...loadedChar };
        if (!mergedChar.combat) {
          mergedChar.combat = defaultChar.combat;
        }
        
        return mergedChar;
      }
      return null;
    } catch (error) {
      console.error('Error loading character:', error);
      return null;
    }
  };

  const checkForSavedCharacter = () => {
    try {
      return localStorage.getItem('narutoCharacter') !== null;
    } catch {
      return false;
    }
  };

  const adjustStat = (stat, change) => {
    const newValue = character.stats[stat] + change;
    const pointsChange = -change;
    
    if (newValue >= 1 && newValue <= 50 && character.pointsRemaining >= pointsChange) {
      setCharacter(prev => ({
        ...prev,
        stats: { ...prev.stats, [stat]: newValue },
        pointsRemaining: prev.pointsRemaining - pointsChange
      }));
    }
  };

  const selectClan = (selectedClan) => {
    const clan = clans.find(c => c.name === selectedClan);
    setCharacter(prev => ({
      ...prev,
      clan: selectedClan,
      jutsu: clan.jutsu.slice(0, 2).map(name => ({ name, damage: 25, cost: 15, type: 'ninjutsu' }))
    }));
    setCurrentScreen('village');
  };

  // Screen Components
  const WelcomeScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          🥷 Naruto RPG Adventure
          <div className="header-subtitle">Ultimate Ninja Experience</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="welcome-container">
          <h1 className="hero-title">NARUTO</h1>
          <p className="hero-subtitle">Ultimate RPG Adventure</p>
          <p className="hero-description">
            {typingText || "Master jutsu, complete missions, battle enemies, and rise through the ninja ranks. Create your legendary ninja and forge your path to greatness in the world of shinobi!"}
          </p>
          <div className="btn-group">
            <button 
              className="btn-primary"
              onClick={() => {
                try {
                  const savedChar = loadCharacter();
                  if (savedChar) {
                    setCharacter(savedChar);
                    setCurrentScreen('village');
                  } else {
                    setCurrentScreen('name');
                  }
                } catch (error) {
                  console.error('Error on button click:', error);
                  setCurrentScreen('name');
                }
              }}
            >
              ⚡ {checkForSavedCharacter() ? 'Continue Adventure' : 'Begin New Adventure'}
            </button>
            {checkForSavedCharacter() && (
              <button 
                className="btn-secondary"
                onClick={() => setCurrentScreen('name')}
              >
                🔄 Start Fresh Adventure
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const NameScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          🎭 Character Creation
          <div className="header-subtitle">Step 1 of 3</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="welcome-container">
          <h2 className="section-title">Who are you, young shinobi?</h2>
          <p className="hero-description">Every legend begins with a name. Choose wisely, for this name will echo through the ninja world.</p>
          <div className="form-group">
            <label className="form-label">Enter your ninja name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
              className="modern-input"
              placeholder="Your legendary name..."
              autoFocus
            />
          </div>
          <div className="nav-container">
            <button className="btn-secondary" onClick={() => setCurrentScreen('welcome')}>
              ← Back
            </button>
            <button 
              className="btn-primary"
              onClick={() => character.name.trim() && setCurrentScreen('clan')}
              disabled={!character.name.trim()}
            >
              Continue → ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ClanScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          🏺 Clan Selection
          <div className="header-subtitle">Step 2 of 3</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="welcome-container">
          <h2 className="section-title">Choose Your Clan Heritage</h2>
          <p className="hero-description">Your bloodline shapes your destiny and determines your starting abilities. Each clan offers unique jutsu and bonuses.</p>
          <div className="card-grid">
            {clans.map((clan) => (
              <div 
                key={clan.name}
                className="selection-card"
                onClick={() => selectClan(clan.name)}
              >
                <div className="card-title">
                  {clan.icon} {clan.name}
                </div>
                <div className="card-description">{clan.description}</div>
                <div className="card-bonus">Bonus: +5 {clan.bonus}</div>
                <div className="tag-list">
                  <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '6px'}}>Starting Jutsu:</p>
                  {clan.jutsu.slice(0, 2).map((jutsu, idx) => (
                    <span key={idx} className="tag">{jutsu}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="nav-container">
            <button className="btn-secondary" onClick={() => setCurrentScreen('name')}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VillageScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          🏘️ {character.village || 'Hidden Village'}
          <div className="header-subtitle">Ninja Hub</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="village-container">
          <div className="status-panel">
            <div className="status-header">
              <div className="character-info">
                <h2>🥷 {character.name}</h2>
                <div className="character-meta">
                  <span>Level {character.level} {character.rank}</span>
                  <span>{character.clan} Clan</span>
                  <span>Missions: {character.completedMissions.length}</span>
                </div>
              </div>
              <div className="money-display">
                💰 {character.money} Ryo
              </div>
            </div>
            
            <div className="stats-grid">
              <div>
                <div className="stat-item">
                  <span className="stat-label">Health</span>
                  <span className="stat-value">{character.combat.hp}/{character.combat.maxHp}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill hp" style={{width: `${(character.combat.hp/character.combat.maxHp)*100}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="stat-item">
                  <span className="stat-label">Chakra</span>
                  <span className="stat-value">{character.combat.chakraPoints}/{character.combat.maxChakra}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill chakra" style={{width: `${(character.combat.chakraPoints/character.combat.maxChakra)*100}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="stat-item">
                  <span className="stat-label">Experience</span>
                  <span className="stat-value">{character.xp} / {character.level * 100}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill xp" style={{width: `${(character.xp % 100)}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="options-grid">
            <div className="option-card" onClick={() => setCurrentScreen('missions')}>
              <span className="option-icon">📜</span>
              <div className="option-title">Mission Board</div>
            </div>
            <div className="option-card" onClick={() => setCurrentScreen('training')}>
              <span className="option-icon">🥋</span>
              <div className="option-title">Training Grounds</div>
            </div>
            <div className="option-card" onClick={() => setCurrentScreen('shop')}>
              <span className="option-icon">🏪</span>
              <div className="option-title">Ninja Shop</div>
            </div>
            <div className="option-card" onClick={() => setCurrentScreen('profile')}>
              <span className="option-icon">👤</span>
              <div className="option-title">Character Profile</div>
            </div>
            <div className="option-card" onClick={restoreHealth}>
              <span className="option-icon">🏥</span>
              <div className="option-title">Rest & Recover</div>
            </div>
          </div>

          {gameLog.length > 0 && (
            <div className="game-log">
              <div className="log-title">📋 Recent Events</div>
              {gameLog.map((log, idx) => (
                <div key={idx} className="log-entry">{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MissionsScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          📜 Mission Board
          <div className="header-subtitle">Available Assignments</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="village-container">
          <h2 className="section-title">Choose Your Mission</h2>
          <div className="card-grid">
            {missions.filter(m => !character.completedMissions.includes(m.id)).map((mission) => (
              <div key={mission.id} className="mission-card">
                <div className="mission-header">
                  <div className="mission-title">{mission.name}</div>
                  <div className={`difficulty-badge ${mission.difficulty.toLowerCase().replace('-', '')}`}>
                    {mission.difficulty}
                  </div>
                </div>
                <div className="mission-description">{mission.description}</div>
                <div className="mission-rewards">
                  <span className="reward-xp">⚡ {mission.xpReward} XP</span>
                  <span className="reward-money">💰 {mission.moneyReward} Ryo</span>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => startMission(mission)}
                  style={{width: '100%', marginTop: '12px'}}
                >
                  Accept Mission ⚡
                </button>
              </div>
            ))}
          </div>
          <div className="nav-container">
            <button className="btn-secondary" onClick={() => setCurrentScreen('village')}>
              ← Back to Village
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BattleScreen = () => {
    if (!battleState) return null;
    
    return (
      <div className="modern-card">
        <div className="modern-header">
          <div className="header-title">
            ⚔️ Combat
            <div className="header-subtitle">Battle Mode</div>
          </div>
        </div>
        <div className="modern-content">
          <div className="battle-container">
            <h2 className="battle-title">⚔️ BATTLE!</h2>
            
            <div className="combatants">
              <div className="combatant">
                <div className="combatant-name">{character.name}</div>
                <div className="stat-item">
                  <span className="stat-label">HP</span>
                  <span className="stat-value">{character.combat.hp}/{character.combat.maxHp}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill hp" style={{width: `${(character.combat.hp/character.combat.maxHp)*100}%`}}></div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Chakra</span>
                  <span className="stat-value">{character.combat.chakraPoints}/{character.combat.maxChakra}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill chakra" style={{width: `${(character.combat.chakraPoints/character.combat.maxChakra)*100}%`}}></div>
                </div>
              </div>
              
              <div className="battle-vs">⚔️</div>
              
              <div className="combatant">
                <div className="combatant-name">{battleState.enemy.name}</div>
                <div className="stat-item">
                  <span className="stat-label">HP</span>
                  <span className="stat-value">{battleState.enemy.hp}/{battleState.enemy.maxHp}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill hp" style={{width: `${(battleState.enemy.hp/battleState.enemy.maxHp)*100}%`}}></div>
                </div>
              </div>
            </div>

            <div className="battle-log">
              {battleState.log.map((entry, idx) => (
                <div key={idx} className="log-entry">{entry}</div>
              ))}
            </div>

            {battleState.turn === 'player' && (
              <div className="battle-actions">
                <h3 className="action-title">Choose your action:</h3>
                <div className="jutsu-grid">
                  {character.jutsu.map((jutsu, idx) => (
                    <div
                      key={idx}
                      className={`jutsu-card ${character.combat.chakraPoints < jutsu.cost ? 'disabled' : ''}`}
                      onClick={() => character.combat.chakraPoints >= jutsu.cost && executeBattleTurn(jutsu)}
                    >
                      <div className="jutsu-name">{jutsu.name}</div>
                      <div className="jutsu-cost">Cost: {jutsu.cost} chakra</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TrainingScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          🥋 Training Grounds
          <div className="header-subtitle">Skill Development</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="village-container">
          <h2 className="section-title">Learn New Jutsu</h2>
          <div className="learn-grid">
            {getAvailableJutsu().map((jutsu, idx) => {
              const cost = jutsu.levelReq ? jutsu.levelReq * 50 : 100;
              const canAfford = character.money >= cost;
              const meetLevel = !jutsu.levelReq || character.level >= jutsu.levelReq;
              
              return (
                <div key={idx} className={`learn-card ${!canAfford || !meetLevel ? 'disabled' : ''}`}>
                  <div className="card-title">{jutsu.name}</div>
                  <div className="jutsu-info">Damage: {jutsu.damage}</div>
                  <div className="jutsu-info">Chakra Cost: {jutsu.cost}</div>
                  <div className="jutsu-info">Type: {jutsu.type}</div>
                  {jutsu.levelReq && (
                    <div className="jutsu-info">Required Level: {jutsu.levelReq}</div>
                  )}
                  <div className="learn-price">💰 {cost} Ryo</div>
                  <button
                    className="learn-button"
                    onClick={() => learnJutsu(jutsu)}
                    disabled={!canAfford || !meetLevel}
                  >
                    {!meetLevel ? 'Level Required' : !canAfford ? 'Insufficient Funds' : 'Learn Jutsu ⚡'}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="nav-container">
            <button className="btn-secondary" onClick={() => setCurrentScreen('village')}>
              ← Back to Village
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="modern-card">
      <div className="modern-header">
        <div className="header-title">
          👤 Ninja Profile
          <div className="header-subtitle">Character Overview</div>
        </div>
      </div>
      <div className="modern-content">
        <div className="profile-container">
          <h2 className="section-title">🥷 {character.name}</h2>
          
          <div className="profile-section">
            <h3 className="card-title">Status Information</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <span>Level</span>
                <span>{character.level}</span>
              </div>
              <div className="profile-item">
                <span>Rank</span>
                <span>{character.rank}</span>
              </div>
              <div className="profile-item">
                <span>Clan</span>
                <span>{character.clan}</span>
              </div>
              <div className="profile-item">
                <span>Village</span>
                <span>{character.village}</span>
              </div>
              <div className="profile-item">
                <span>Money</span>
                <span>{character.money} Ryo</span>
              </div>
              <div className="profile-item">
                <span>Missions</span>
                <span>{character.completedMissions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-section">
            <h3 className="card-title">Combat Statistics</h3>
            <div className="profile-grid">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="profile-item">
                  <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h3 className="card-title">Known Jutsu</h3>
            {character.jutsu.map((jutsu, idx) => (
              <div key={idx} className="jutsu-profile-card">
                <div className="jutsu-profile-name">{jutsu.name}</div>
                <div className="jutsu-profile-details">
                  Damage: {jutsu.damage} | Chakra: {jutsu.cost} | Type: {jutsu.type}
                </div>
              </div>
            ))}
          </div>
          
          <div className="nav-container">
            <button className="btn-secondary" onClick={() => setCurrentScreen('village')}>
              ← Back to Village
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'welcome': return <WelcomeScreen />;
        case 'name': return <NameScreen />;
        case 'clan': return <ClanScreen />;
        case 'village': return <VillageScreen />;
        case 'missions': return <MissionsScreen />;
        case 'battle': return <BattleScreen />;
        case 'training': return <TrainingScreen />;
        case 'profile': return <ProfileScreen />;
        default: return <WelcomeScreen />;
      }
    } catch (error) {
      console.error('Error rendering screen:', error);
      return <WelcomeScreen />;
    }
  };

  useEffect(() => {
    const timer = typeWriter("Master jutsu, complete missions, battle enemies, and rise through the ninja ranks. Create your legendary ninja and forge your path to greatness in the world of shinobi!");
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      if (character.name) {
        saveCharacter();
      }
    } catch (error) {
      console.error('Error in save effect:', error);
    }
  }, [character.name, character.level, character.xp, character.money, character.clan, character.village]);

  return (
    <div className="game-container">
      {renderScreen()}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <NarutoGame />
    </div>
  );
}

export default App;