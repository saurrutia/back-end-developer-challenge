import { useState, useEffect, useCallback } from 'react';
import { characterService } from '../services/characterService';
import { signalRService } from '../services/signalRService';
import type { Character } from '../types/character';

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await characterService.getAllCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSingleCharacter = useCallback(async (characterId: string) => {
    try {
      const updatedCharacter = await characterService.getCharacterById(characterId);
      setCharacters(prev => 
        prev.map(char => char.id === characterId ? updatedCharacter : char)
      );
    } catch (err) {
      console.error('Failed to update character:', err);
      // Fallback to full reload if single update fails
      loadCharacters();
    }
  }, [loadCharacters]);

  useEffect(() => {
    // Subscribe to character updates
    const unsubscribe = signalRService.onCharacterUpdated((characterId: string) => {
      console.log('Character updated via SignalR:', characterId);
      // Update only the specific character instead of reloading all
      updateSingleCharacter(characterId);
    });

    // Start SignalR connection (safe to call multiple times)
    signalRService.start().catch(err => {
      console.error('Failed to start SignalR:', err);
    });

    // Load initial data
    loadCharacters();

    // Cleanup - only unsubscribe, don't stop the service (it's shared)
    return () => {
      unsubscribe();
    };
  }, [loadCharacters, updateSingleCharacter]);

  return {
    characters,
    loading,
    error,
    reload: loadCharacters,
  };
};
