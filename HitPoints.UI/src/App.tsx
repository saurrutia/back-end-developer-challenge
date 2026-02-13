import { useState, useCallback } from 'react';
import { Button, Spin } from 'antd';
import { CharacterCard } from './components/character-card/CharacterCard';
import { ActionsCard } from './components/actions-card/ActionsCard';
import { useCharacters } from './hooks/useCharacters';
import './App.css';

type ActionType = 'damage' | 'heal' | 'tempHp';

function App() {
  const { characters, loading, error, reload } = useCharacters();
  const [highlightedCharacter, setHighlightedCharacter] = useState<{ id: string; type: ActionType } | null>(null);

  const handleActionPerformed = useCallback((characterId: string, actionType: ActionType) => {
    setHighlightedCharacter({ id: characterId, type: actionType });

    setTimeout(() => {
      setHighlightedCharacter(null);
    }, 1000);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" description="Loading characters..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Button type="primary" onClick={reload}>
            Retry
          </Button>
        </div>
      );
    }

    return (
      <>
        <ActionsCard characters={characters} onActionPerformed={handleActionPerformed} />
        <div className="characters-grid">
          {characters.length === 0 ? (
            <p className="no-characters">No characters found</p>
          ) : (
            characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                highlightType={highlightedCharacter?.id === character.id ? highlightedCharacter.type : null}
              />
            ))
          )}
        </div>
      </>
    );
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">D&D Character Manager</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
