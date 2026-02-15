import type { Character } from '@/types/character';

export const mockCharacter: Character = {
  id: 'briv',
  name: 'Briv',
  level: 5,
  hitPoints: 25,
  currentHitPoints: 20,
  temporaryHitPoints: 5,
  classes: ['fighter'],
  stats: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 10,
    charisma: 8,
  },
  itemsAffectingStats: [
    {
      name: 'Ioun Stone of Fortitude',
      modifierStat: 'constitution',
      modifierValue: 2,
    },
  ],
  defenses: [
    { type: 'Fire', defense: 'Immunity' },
    { type: 'Slashing', defense: 'Resistance' },
  ],
};

export const mockCharacterFullHealth: Character = {
  id: 'elara',
  name: 'Elara',
  level: 3,
  hitPoints: 20,
  currentHitPoints: 20,
  temporaryHitPoints: 0,
  classes: ['wizard'],
  stats: {
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 18,
    wisdom: 13,
    charisma: 10,
  },
  itemsAffectingStats: [],
  defenses: [],
};

export const mockCharacterLowHealth: Character = {
  id: 'thorgrim',
  name: 'Thorgrim',
  level: 7,
  hitPoints: 50,
  currentHitPoints: 10,
  temporaryHitPoints: 0,
  classes: ['barbarian'],
  stats: {
    strength: 18,
    dexterity: 10,
    constitution: 16,
    intelligence: 8,
    wisdom: 12,
    charisma: 9,
  },
  itemsAffectingStats: [
    {
      name: 'Belt of Giant Strength',
      modifierStat: 'strength',
      modifierValue: 4,
    },
  ],
  defenses: [
    { type: 'Cold', defense: 'Resistance' },
  ],
};

export const mockCharacters: Character[] = [
  mockCharacter,
  mockCharacterFullHealth,
  mockCharacterLowHealth,
];
