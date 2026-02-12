import type { Character, DamageType } from '../types/character';

const API_BASE_URL = 'http://localhost:5259';

export const characterService = {
  async getAllCharacters(): Promise<Character[]> {
    const response = await fetch(`${API_BASE_URL}/characters`);
    if (!response.ok) {
      throw new Error('Failed to fetch characters');
    }
    return response.json();
  },

  async dealDamage(characterId: string, damageType: DamageType, damage: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/characters/damage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characterId,
        damageType,
        damage,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to deal damage');
    }
  },

  async heal(characterId: string, amount: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/characters/heal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characterId,
        amount,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to heal character');
    }
  },

  async addTemporaryHitPoints(characterId: string, amount: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/characters/temporary-hit-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characterId,
        amount,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add temporary hit points');
    }
  },
};
