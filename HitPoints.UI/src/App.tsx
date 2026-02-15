import { useState, useCallback } from 'react';
import { Button, Spin } from 'antd';
import { CharacterCard } from './components/character-card/CharacterCard';
import { ActionsCard } from './components/actions-card/ActionsCard';
import { useCharacters } from './hooks/useCharacters';
import styles from './App.module.css';
import type { Character, DamageType } from './types/character';

type ActionType = 'damage' | 'heal' | 'tempHp';

function App() {
  const { characters, loading, error, reload } = useCharacters();
  const [highlightedCharacter, setHighlightedCharacter] = useState<{ id: string; type: ActionType, damageType?: DamageType } | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');

  const handleActionPerformed = useCallback((characterId: string, actionType: ActionType, damageType?: DamageType) => {
    setHighlightedCharacter({ id: characterId, type: actionType, damageType });

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

    const highlightType = (character: Character) => {
      if (!highlightedCharacter) return null;
      if (highlightedCharacter.id !== character.id) return null;
      if (highlightedCharacter.type === 'damage'){
        if (character.defenses.some(d => d.defense.toLowerCase() === 'resistance' && d.type.toLowerCase() === highlightedCharacter.damageType?.toLowerCase())) {
          return 'resistance';
        }
        if (character.defenses.some(d => d.defense.toLowerCase() === 'immunity' && d.type.toLowerCase() === highlightedCharacter.damageType?.toLowerCase())) {
          return 'none';
        }
        return 'damage';
      }
      return highlightedCharacter.type;
    }


    const filteredCharacters = selectedCharacterId 
      ? characters.filter(c => c.id === selectedCharacterId)
      : characters;
      
    return (
      <>
        <ActionsCard 
          characters={characters} 
          onActionPerformed={handleActionPerformed} 
          onCharacterSelect={setSelectedCharacterId}
        />
        <div className={styles.charactersGrid} role="list" aria-label="Character cards">
          {filteredCharacters.length === 0 ? (
            <p className={styles.noCharacters} role="status">No characters found</p>
          ) : (
            filteredCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                highlightType={highlightType(character)}
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
