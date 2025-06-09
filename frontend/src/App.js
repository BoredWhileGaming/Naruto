import React, { useState, useEffect } from 'react';
import './App.css';

const NarutoGame = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [character, setCharacter] = useState({
    name: '',
    clan: '',
    village: '',
    stats: {
      strength: 10,
      speed: 10,
      chakra: 10,
      intelligence: 10,
      stamina: 10
    },
    jutsu: [],
    pointsRemaining: 25
  });
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const clans = [
    { name: 'Uchiha', bonus: 'chakra', description: 'Masters of fire jutsu and Sharingan', jutsu: ['Fireball Jutsu', 'Phoenix Flower Jutsu'] },
    { name: 'Hyuga', bonus: 'speed', description: 'Gentle Fist masters with Byakugan', jutsu: ['Gentle Fist', 'Eight Trigrams Palm'] },
    { name: 'Uzumaki', bonus: 'stamina', description: 'Massive chakra reserves and sealing jutsu', jutsu: ['Shadow Clone Jutsu', 'Sealing Technique'] },
    { name: 'Nara', bonus: 'intelligence', description: 'Strategic geniuses with shadow manipulation', jutsu: ['Shadow Bind', 'Shadow Imitation'] },
    { name: 'Akimichi', bonus: 'strength', description: 'Size manipulation and immense physical power', jutsu: ['Expansion Jutsu', 'Human Boulder'] },
    { name: 'Inuzuka', bonus: 'speed', description: 'Beast-like fighting with canine partners', jutsu: ['Fang Over Fang', 'Beast Clone'] }
  ];

  const villages = [
    { name: 'Konohagakure', symbol: '🍃', description: 'Village Hidden in the Leaves' },
    { name: 'Sunagakure', symbol: '🏜️', description: 'Village Hidden in the Sand' },
    { name: 'Kirigakure', symbol: '🌊', description: 'Village Hidden in the Mist' },
    { name: 'Kumogakure', symbol: '⛈️', description: 'Village Hidden in the Clouds' },
    { name: 'Iwagakure', symbol: '🗻', description: 'Village Hidden in the Rocks' }
  ];

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
      setCharacter(JSON.parse(saved));
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
      jutsu: clan.jutsu
    }));
    setCurrentScreen('village');
  };

  const WelcomeScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Naruto Text Adventure</div>
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
                                                          
                    TEXT ADVENTURE GAME
`}
        </pre>
        <div className="terminal-text">
          <p className="text-orange-400 mb-4">Welcome to the Hidden Villages...</p>
          <p className="text-blue-300 mb-6">
            {typingText || "In this world of shinobi, your journey begins with a single choice. Will you rise to become a legendary ninja, or fade into the shadows of history?"}
          </p>
          <div className="menu-options">
            <button 
              className="menu-button"
              onClick={() => {
                if (loadCharacter()) {
                  setCurrentScreen('profile');
                } else {
                  setCurrentScreen('name');
                }
              }}
            >
              {loadCharacter() ? '► Continue Journey' : '► Begin New Journey'}
            </button>
            {loadCharacter() && (
              <button 
                className="menu-button"
                onClick={() => setCurrentScreen('name')}
              >
                ► Start Fresh Journey
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
                <p className="text-green-400 text-xs">Bonus: +5 {clan.bonus}</p>
                <div className="jutsu-list">
                  {clan.jutsu.map((jutsu, idx) => (
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
        <div className="terminal-title">Village Selection</div>
      </div>
      <div className="terminal-content">
        <div className="creation-step">
          <h2 className="text-yellow-400 text-2xl mb-6">🏘️ Choose Your Hidden Village</h2>
          <p className="text-blue-300 mb-6">Where will you pledge your loyalty?</p>
          <div className="village-grid">
            {villages.map((village) => (
              <div 
                key={village.name}
                className="village-card"
                onClick={() => {
                  setCharacter(prev => ({ ...prev, village: village.name }));
                  setCurrentScreen('stats');
                }}
              >
                <div className="village-symbol">{village.symbol}</div>
                <h3 className="text-orange-400 text-lg font-bold">{village.name}</h3>
                <p className="text-gray-300 text-sm">{village.description}</p>
              </div>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('clan')}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatsScreen = () => (
    <div className="terminal-screen">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">Stat Allocation</div>
      </div>
      <div className="terminal-content">
        <div className="creation-step">
          <h2 className="text-yellow-400 text-2xl mb-6">⚡ Distribute Your Abilities</h2>
          <p className="text-blue-300 mb-4">Points Remaining: <span className="text-green-400 font-bold">{character.pointsRemaining}</span></p>
          <div className="stats-grid">
            {Object.entries(character.stats).map(([stat, value]) => (
              <div key={stat} className="stat-row">
                <label className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                <div className="stat-controls">
                  <button 
                    className="stat-button"
                    onClick={() => adjustStat(stat, -1)}
                    disabled={value <= 1}
                  >
                    -
                  </button>
                  <span className="stat-value">{value}</span>
                  <button 
                    className="stat-button"
                    onClick={() => adjustStat(stat, 1)}
                    disabled={value >= 50 || character.pointsRemaining <= 0}
                  >
                    +
                  </button>
                </div>
                <div className="stat-bar">
                  <div 
                    className="stat-fill"
                    style={{ width: `${(value / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('village')}>
              ← Back
            </button>
            <button 
              className="nav-button primary"
              onClick={() => {
                saveCharacter();
                setCurrentScreen('profile');
              }}
            >
              Complete Creation →
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
            <h3 className="text-orange-400 text-xl mb-3">Heritage</h3>
            <p className="text-blue-300">Clan: <span className="text-white">{character.clan}</span></p>
            <p className="text-blue-300">Village: <span className="text-white">{character.village}</span></p>
          </div>
          
          <div className="profile-section">
            <h3 className="text-orange-400 text-xl mb-3">Abilities</h3>
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
                <span key={idx} className="jutsu-badge">{jutsu}</span>
              ))}
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => setCurrentScreen('welcome')}>
              ← Main Menu
            </button>
            <button className="nav-button" onClick={() => setCurrentScreen('stats')}>
              Modify Stats
            </button>
            <button className="nav-button primary">
              Begin Adventure →
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
      case 'stats': return <StatsScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <WelcomeScreen />;
    }
  };

  useEffect(() => {
    typeWriter("In this world of shinobi, your journey begins with a single choice. Will you rise to become a legendary ninja, or fade into the shadows of history?");
  }, []);

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