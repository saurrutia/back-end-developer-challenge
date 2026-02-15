import { useState, useCallback } from 'react';
import { Button, Spin } from 'antd';
import { CharacterCard } from './components/character-card/CharacterCard';
import { ActionsCard } from './components/actions-card/ActionsCard';
import { useCharacters } from './hooks/useCharacters';
import styles from './App.module.css';

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
        <div className={styles.loadingContainer} role="status" aria-live="polite">
          <Spin size="large" aria-label="Loading characters..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer} role="alert" aria-live="assertive">
          <p className={styles.errorMessage}>{error}</p>
          <Button type="primary" onClick={reload} aria-label="Retry loading characters">
            Retry
          </Button>
        </div>
      );
    }

    return (
      <>
        <ActionsCard characters={characters} onActionPerformed={handleActionPerformed} />
        <div className={styles.charactersGrid} role="list" aria-label="Character cards">
          {characters.length === 0 ? (
            <p className={styles.noCharacters} role="status">No characters found</p>
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
    <div className={styles.appContainer}>
      <div className={styles.appContent} role="banner">
        <h2 className={styles.appTitle}>D&D Character Manager</h2>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
