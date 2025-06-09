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

  const clans = [
    { 
      name: 'Uchiha', 
      bonus: 'chakra', 
      description: 'Masters of fire jutsu and Sharingan', 
      jutsu: ['Fireball Jutsu', 'Phoenix Flower Jutsu', 'Dragon Fire Technique'],
      advanced: ['Chidori', 'Amaterasu', 'Susanoo']
    },
    { 
      name: 'Hyuga', 
      bonus: 'speed', 
      description: 'Gentle Fist masters with Byakugan', 
      jutsu: ['Gentle Fist', 'Eight Trigrams Palm', 'Byakugan'],
      advanced: ['Eight Trigrams 64 Palms', 'Rotation', 'Air Palm']
    },
    { 
      name: 'Uzumaki', 
      bonus: 'stamina', 
      description: 'Massive chakra reserves and sealing jutsu', 
      jutsu: ['Shadow Clone Jutsu', 'Sealing Technique', 'Chakra Chains'],
      advanced: ['Multiple Shadow Clones', 'Four Symbols Seal', 'Adamantine Chains']
    },
    { 
      name: 'Nara', 
      bonus: 'intelligence', 
      description: 'Strategic geniuses with shadow manipulation', 
      jutsu: ['Shadow Bind', 'Shadow Imitation', 'Shadow Neck Bind'],
      advanced: ['Shadow Sewing', 'Shadow Gathering', 'Shadow Shadow Technique']
    },
    { 
      name: 'Akimichi', 
      bonus: 'strength', 
      description: 'Size manipulation and immense physical power', 
      jutsu: ['Expansion Jutsu', 'Human Boulder', 'Partial Expansion'],
      advanced: ['Super Expansion', 'Butterfly Mode', 'Calorie Control']
    },
    { 
      name: 'Inuzuka', 
      bonus: 'speed', 
      description: 'Beast-like fighting with canine partners', 
      jutsu: ['Fang Over Fang', 'Beast Clone', 'Four Legs Technique'],
      advanced: ['Two-Headed Wolf', 'Tunneling Fang', 'Wolf Fang Over Fang']
    }
  ];

  const villages = [
    { name: 'Konohagakure', symbol: '🍃', description: 'Village Hidden in the Leaves' },
    { name: 'Sunagakure', symbol: '🏜️', description: 'Village Hidden in the Sand' },
    { name: 'Kirigakure', symbol: '🌊', description: 'Village Hidden in the Mist' },
    { name: 'Kumogakure', symbol: '⛈️', description: 'Village Hidden in the Clouds' },
    { name: 'Iwagakure', symbol: '🗻', description: 'Village Hidden in the Rocks' }
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
      description: 'A village cat has gone missing. Find and return it safely.',
      difficulty: 'D-Rank',
      xpReward: 50,
      moneyReward: 100,
      type: 'search',
      completed: false
    },
    {
      id: 2,
      name: 'Escort the Merchant',
      description: 'Escort a merchant safely to the next village.',
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
      description: 'Clear out bandits that have been terrorizing travelers.',
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
      description: 'A secret jutsu scroll has been stolen. Retrieve it from enemy ninja.',
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
      description: 'Undergo special training to improve your abilities.',
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

      // Player turn
      if (playerJutsu) {
        const damage = Math.floor(playerJutsu.damage * (character.stats.strength / 10));
        newEnemy.hp = Math.max(0, newEnemy.hp - damage);
        newCharacter.combat.chakraPoints = Math.max(0, newCharacter.combat.chakraPoints - playerJutsu.cost);
        newLog.push(`You used ${playerJutsu.name}! Dealt ${damage} damage.`);
      }

      // Check if enemy defeated
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

      // Enemy turn
      const enemyDamage = Math.floor(newEnemy.strength * (Math.random() * 0.5 + 0.75));
      newCharacter.combat.hp = Math.max(0, newCharacter.combat.hp - enemyDamage);
      newLog.push(`${newEnemy.name} attacks! You take ${enemyDamage} damage.`);

      // Check if player defeated
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
      // Training mission - just gain XP
      setTimeout(() => {
        gainXP(mission.xpReward);
        addToLog(`Training complete! Gained ${mission.xpReward} XP.`);
        completeMission(mission);
      }, 2000);
    } else if (mission.enemyEncounter) {
      // Mission with combat
      setTimeout(() => {
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        startBattle(randomEnemy);
      }, 3000);
    } else {
      // Simple mission - complete after delay
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

  // Existing functions...
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
  };

  const saveCharacter = () => {
    localStorage.setItem('narutoCharacter', JSON.stringify(character));
  };

  const loadCharacter = () => {
    const saved = localStorage.getItem('narutoCharacter');
    if (saved) {
      const loadedChar = JSON.parse(saved);
      // Ensure combat stats exist for older saves
      if (!loadedChar.combat) {
        loadedChar.combat = {
          hp: 100,
          maxHp: 100,
          chakraPoints: 50,
          maxChakra: 50
        };
      }
      if (!loadedChar.level) loadedChar.level = 1;
      if (!loadedChar.xp) loadedChar.xp = 0;
      if (!loadedChar.inventory) loadedChar.inventory = [];
      if (!loadedChar.completedMissions) loadedChar.completedMissions = [];
      if (!loadedChar.money) loadedChar.money = 100;
      
      setCharacter(loadedChar);
      return true;
    }
    return false;
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

  // Screen Components...
  const WelcomeScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Naruto RPG Adventure</div>
      </div>
      <div className="terminal-content">
        <pre className="ascii-art">
{`
    ███╗   ██╗ █████╗ ██████╗ ██╗   ██╗████████╗ ██████╗ 
    ████╗  ██║██╔══██╗██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗
    ██╔██╗ ██║███████║██████╔╝██║   ██║   ██║   ██║   ██║
    ██║╚██╗██║██╔══██║██╔══██╗██║   ██║   ██║   ██║   ██║
    ██║ ╚████║██║  ██║██║  ██║╚██████╔╝   ██║   ╚██████╔╝
    ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ 
                                                          
                    RPG ADVENTURE GAME
`}
        </pre>
        <div className="terminal-text">
          <p className="text-orange-400 mb-4">Welcome to the Ultimate Ninja Adventure...</p>
          <p className="text-blue-300 mb-6">
            {typingText || "Master jutsu, complete missions, battle enemies, and rise through the ninja ranks. Your legend starts here!"}
          </p>
          <div className="menu-options">
            <button 
              className="menu-button"
              onClick={() => {
                if (loadCharacter()) {
                  setCurrentScreen('village');
                } else {
                  setCurrentScreen('name');
                }
              }}
            >
              {loadCharacter() ? '► Continue Adventure' : '► Begin New Adventure'}
            </button>
            {loadCharacter() && (
              <button 
                className="menu-button"
                onClick={() => setCurrentScreen('name')}
              >
                ► Start Fresh Adventure
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const NameScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Character Creation</div>
      </div>
      <div className="terminal-content">
        <div className="creation-step">
          <h2 className="text-yellow-400 text-2xl mb-6">🎭 Who are you, young shinobi?</h2>
          <p className="text-blue-300 mb-4">Every legend begins with a name...</p>
          <div className="input-group">
            <label className="text-orange-400">Enter your ninja name:</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
              className="ninja-input"
              placeholder="Your ninja name..."
              autoFocus
            />
          </div>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('welcome')}>
              ← Back
            </button>
            <button 
              className="nav-button primary"
              onClick={() => character.name.trim() && setCurrentScreen('clan')}
              disabled={!character.name.trim()}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ClanScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Clan Selection</div>
      </div>
      <div className="terminal-content">
        <div className="creation-step">
          <h2 className="text-yellow-400 text-2xl mb-6">🏺 Choose Your Clan Heritage</h2>
          <p className="text-blue-300 mb-6">Your bloodline shapes your destiny...</p>
          <div className="clan-grid">
            {clans.map((clan) => (
              <div 
                key={clan.name}
                className="clan-card"
                onClick={() => selectClan(clan.name)}
              >
                <h3 className="text-orange-400 text-lg font-bold">{clan.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{clan.description}</p>
                <p className="text-green-400 text-xs mb-2">Bonus: +5 {clan.bonus}</p>
                <div className="jutsu-list">
                  <p className="text-blue-300 text-xs mb-1">Starting Jutsu:</p>
                  {clan.jutsu.slice(0, 2).map((jutsu, idx) => (
                    <span key={idx} className="jutsu-tag">{jutsu}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('name')}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VillageScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">{character.village || 'Hidden Village'}</div>
      </div>
      <div className="terminal-content">
        <div className="village-hub">
          <div className="village-header">
            <h2 className="text-yellow-400 text-2xl mb-2">
              🏘️ Welcome to {character.village || 'Your Village'}
            </h2>
            <div className="character-status">
              <div className="status-row">
                <span className="text-orange-400">Level {character.level} {character.rank}</span>
                <span className="text-green-400">{character.money} Ryo</span>
              </div>
              <div className="health-bars">
                <div className="health-bar">
                  <span className="text-red-400">HP: {character.combat.hp}/{character.combat.maxHp}</span>
                  <div className="bar">
                    <div className="bar-fill hp" style={{width: `${(character.combat.hp/character.combat.maxHp)*100}%`}}></div>
                  </div>
                </div>
                <div className="health-bar">
                  <span className="text-blue-400">Chakra: {character.combat.chakraPoints}/{character.combat.maxChakra}</span>
                  <div className="bar">
                    <div className="bar-fill chakra" style={{width: `${(character.combat.chakraPoints/character.combat.maxChakra)*100}%`}}></div>
                  </div>
                </div>
              </div>
              <div className="xp-bar">
                <span className="text-yellow-400">XP: {character.xp} / {character.level * 100}</span>
                <div className="bar">
                  <div className="bar-fill xp" style={{width: `${(character.xp % 100)}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="village-options">
            <button className="village-button" onClick={() => setCurrentScreen('missions')}>
              📜 Mission Board
            </button>
            <button className="village-button" onClick={() => setCurrentScreen('training')}>
              🥋 Training Grounds
            </button>
            <button className="village-button" onClick={() => setCurrentScreen('shop')}>
              🏪 Ninja Shop
            </button>
            <button className="village-button" onClick={() => setCurrentScreen('profile')}>
              👤 Character Profile
            </button>
            <button className="village-button" onClick={restoreHealth}>
              🏥 Rest & Recover
            </button>
          </div>

          {gameLog.length > 0 && (
            <div className="game-log">
              <h3 className="text-green-400 mb-2">Recent Events:</h3>
              {gameLog.map((log, idx) => (
                <p key={idx} className="log-entry">{log}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MissionsScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Mission Board</div>
      </div>
      <div className="terminal-content">
        <div className="missions-hub">
          <h2 className="text-yellow-400 text-2xl mb-6">📜 Available Missions</h2>
          <div className="missions-grid">
            {missions.filter(m => !character.completedMissions.includes(m.id)).map((mission) => (
              <div key={mission.id} className="mission-card">
                <div className="mission-header">
                  <h3 className="text-orange-400">{mission.name}</h3>
                  <span className={`difficulty ${mission.difficulty.toLowerCase().replace('-', '')}`}>
                    {mission.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{mission.description}</p>
                <div className="mission-rewards">
                  <span className="text-yellow-400">XP: {mission.xpReward}</span>
                  <span className="text-green-400">Ryo: {mission.moneyReward}</span>
                </div>
                <button 
                  className="mission-accept-btn"
                  onClick={() => startMission(mission)}
                >
                  Accept Mission
                </button>
              </div>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('village')}>
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
      <div className="terminal-screen">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button red"></div>
            <div className="terminal-button yellow"></div>
            <div className="terminal-button green"></div>
          </div>
          <div className="terminal-title">Combat</div>
        </div>
        <div className="terminal-content">
          <div className="battle-arena">
            <h2 className="text-red-400 text-2xl mb-6">⚔️ Battle!</h2>
            
            <div className="battle-status">
              <div className="combatant player">
                <h3 className="text-blue-400">{character.name}</h3>
                <div className="health-bar">
                  <span>HP: {character.combat.hp}/{character.combat.maxHp}</span>
                  <div className="bar">
                    <div className="bar-fill hp" style={{width: `${(character.combat.hp/character.combat.maxHp)*100}%`}}></div>
                  </div>
                </div>
                <div className="health-bar">
                  <span>Chakra: {character.combat.chakraPoints}/{character.combat.maxChakra}</span>
                  <div className="bar">
                    <div className="bar-fill chakra" style={{width: `${(character.combat.chakraPoints/character.combat.maxChakra)*100}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="vs-indicator">⚔️</div>
              
              <div className="combatant enemy">
                <h3 className="text-red-400">{battleState.enemy.name}</h3>
                <div className="health-bar">
                  <span>HP: {battleState.enemy.hp}/{battleState.enemy.maxHp}</span>
                  <div className="bar">
                    <div className="bar-fill hp" style={{width: `${(battleState.enemy.hp/battleState.enemy.maxHp)*100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="battle-log">
              {battleState.log.map((entry, idx) => (
                <p key={idx} className="log-entry">{entry}</p>
              ))}
            </div>

            {battleState.turn === 'player' && (
              <div className="battle-actions">
                <h3 className="text-yellow-400 mb-3">Choose your action:</h3>
                <div className="jutsu-grid">
                  {character.jutsu.map((jutsu, idx) => (
                    <button
                      key={idx}
                      className={`jutsu-button ${character.combat.chakraPoints < jutsu.cost ? 'disabled' : ''}`}
                      onClick={() => executeBattleTurn(jutsu)}
                      disabled={character.combat.chakraPoints < jutsu.cost}
                    >
                      <span className="jutsu-name">{jutsu.name}</span>
                      <span className="jutsu-cost">Cost: {jutsu.cost}</span>
                    </button>
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
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Training Grounds</div>
      </div>
      <div className="terminal-content">
        <div className="training-hub">
          <h2 className="text-yellow-400 text-2xl mb-6">🥋 Training Grounds</h2>
          
          <div className="training-section">
            <h3 className="text-orange-400 text-xl mb-4">Learn New Jutsu</h3>
            <div className="jutsu-learn-grid">
              {getAvailableJutsu().map((jutsu, idx) => {
                const cost = jutsu.levelReq ? jutsu.levelReq * 50 : 100;
                const canAfford = character.money >= cost;
                const meetLevel = !jutsu.levelReq || character.level >= jutsu.levelReq;
                
                return (
                  <div key={idx} className={`jutsu-learn-card ${!canAfford || !meetLevel ? 'disabled' : ''}`}>
                    <h4 className="text-blue-400">{jutsu.name}</h4>
                    <p className="text-gray-300">Damage: {jutsu.damage}</p>
                    <p className="text-gray-300">Cost: {jutsu.cost} chakra</p>
                    <p className="text-gray-300">Type: {jutsu.type}</p>
                    {jutsu.levelReq && (
                      <p className="text-yellow-400">Requires Level {jutsu.levelReq}</p>
                    )}
                    <p className="text-green-400">Price: {cost} Ryo</p>
                    <button
                      className="learn-button"
                      onClick={() => learnJutsu(jutsu)}
                      disabled={!canAfford || !meetLevel}
                    >
                      {!meetLevel ? 'Level Required' : !canAfford ? 'Insufficient Funds' : 'Learn Jutsu'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('village')}>
              ← Back to Village
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Ninja Profile</div>
      </div>
      <div className="terminal-content">
        <div className="profile-display">
          <h2 className="text-yellow-400 text-3xl mb-6">🥷 {character.name}</h2>
          
          <div className="profile-section">
            <h3 className="text-orange-400 text-xl mb-3">Status</h3>
            <div className="status-grid">
              <p className="text-blue-300">Level: <span className="text-white">{character.level}</span></p>
              <p className="text-blue-300">Rank: <span className="text-white">{character.rank}</span></p>
              <p className="text-blue-300">Clan: <span className="text-white">{character.clan}</span></p>
              <p className="text-blue-300">Village: <span className="text-white">{character.village}</span></p>
              <p className="text-blue-300">Money: <span className="text-green-400">{character.money} Ryo</span></p>
              <p className="text-blue-300">Missions Completed: <span className="text-white">{character.completedMissions.length}</span></p>
            </div>
          </div>
          
          <div className="profile-section">
            <h3 className="text-orange-400 text-xl mb-3">Combat Stats</h3>
            <div className="stats-display">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="stat-display">
                  <span className="stat-name">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                  <span className="stat-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h3 className="text-orange-400 text-xl mb-3">Known Jutsu</h3>
            <div className="jutsu-display">
              {character.jutsu.map((jutsu, idx) => (
                <div key={idx} className="jutsu-card">
                  <span className="jutsu-name">{jutsu.name}</span>
                  <span className="jutsu-details">
                    Damage: {jutsu.damage} | Cost: {jutsu.cost} | Type: {jutsu.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('village')}>
              ← Back to Village
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen />;
      case 'name': return <NameScreen />;
      case 'clan': return <ClanScreen />;
      case 'village': return <VillageScreen />;
      case 'missions': return <MissionsScreen />;
      case 'battle': return <BattleScreen />;
      case 'training': return <TrainingScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <VillageScreen />;
    }
  };

  useEffect(() => {
    typeWriter("Master jutsu, complete missions, battle enemies, and rise through the ninja ranks. Your legend starts here!");
  }, []);

  useEffect(() => {
    if (character.name) {
      saveCharacter();
    }
  }, [character]);

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