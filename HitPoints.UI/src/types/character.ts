export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Item {
  name: string;
  modifierStat: string;
  modifierValue: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  hitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  classes: string[];
  stats: Stats;
  itemsAffectingStats: Item[];
}

export const DamageType = {
  Bludgeoning: 'Bludgeoning',
  Piercing: 'Piercing',
  Slashing: 'Slashing',
  Fire: 'Fire',
  Cold: 'Cold',
  Lightning: 'Lightning',
  Acid: 'Acid',
  Poison: 'Poison',
  Psychic: 'Psychic',
  Necrotic: 'Necrotic',
  Radiant: 'Radiant',
  Force: 'Force'
} as const;

export type DamageType = typeof DamageType[keyof typeof DamageType];
