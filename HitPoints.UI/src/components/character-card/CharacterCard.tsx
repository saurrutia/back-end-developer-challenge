import type { Character, DamageType } from '../../types/character';
import { Card, Progress, Tag, Typography, Tooltip } from 'antd';
import styles from './CharacterCard.module.css';

const { Title } = Typography;

interface CharacterCardProps {
  character: Character;
  highlightType?: 'damage' | 'heal' | 'tempHp' | 'resistance' | 'none' | null;
}

export const CharacterCard = ({ character, highlightType }: CharacterCardProps) => {
  const hpPercentage = (character.currentHitPoints / character.hitPoints) * 100;

  const getHighlightClass = () => {
    if (!highlightType) return '';
    switch (highlightType) {
      case 'damage':
        return styles.characterCardHighlightDamage;
      case 'heal':
        return styles.characterCardHighlightHeal;
      case 'tempHp':
        return styles.characterCardHighlightTempHp;
      case 'resistance':
        return styles.characterCardHighlightResistance;
      case 'none':
        return styles.characterCardHighlightNone;
    }
  };

  const getProgressStatus = () => {
    if (hpPercentage > 50) return 'success';
    return 'exception';
  };

  const getAdditionalValue = (stat: string) => {
    return character.itemsAffectingStats
      .filter(item => item.modifierStat.toLowerCase() === stat.toLowerCase())
      .reduce((acc, item) => acc + item.modifierValue, 0);
  }

  return (
    <Card
      className={`${styles.characterCard} ${getHighlightClass()}`}
      data-testid={`card-${character.id}`}
      title={character.name}
      role="listitem"
      aria-label={`Character card for ${character.name}`}
      extra={
        <span style={{ fontSize: '14px', color: '#888' }} aria-label={`Class and level: ${character.classes.join(', ')} level ${character.level}`}>
          {character.classes.join(', ') || 'Unknown'} • Level {character.level}
        </span>
      }
    >
      {/* Hit Points Section */}
      <div className={styles.characterCardSection}>
        <div className={styles.characterCardHpHeader}>
          <Title level={3} id={`${character.id}-hp-label`}>Hit Points</Title>
          <span aria-labelledby={`${character.id}-hp-label`}>
            {character.currentHitPoints}/{character.hitPoints}
          </span>
        </div>
        <Progress
          percent={hpPercentage}
          status={getProgressStatus()}
          showInfo={false}
          aria-label={`Hit points: ${character.currentHitPoints} out of ${character.hitPoints}`}
        />
        <div className={styles.characterCardTempHp}>
            <span>Temporary HP:</span>
            <Tag color="blue" aria-label={`${character.temporaryHitPoints} temporary hit points`}>{character.temporaryHitPoints}</Tag>
          </div>
      </div>

      {/* Stats Section */}
      <div className={styles.characterCardSection}>
        <Title level={3} id={`${character.id}-stats-label`}>Ability Scores</Title>
        <div className={styles.characterCardStatsGrid} role="list" aria-labelledby={`${character.id}-stats-label`}>
          <StatBox characterId={character.id} label="STR" stat="Strength" value={character.stats.strength} additionalValue={getAdditionalValue("Strength")} />
          <StatBox characterId={character.id} label="DEX" stat="Dexterity" value={character.stats.dexterity} additionalValue={getAdditionalValue("Dexterity")} />
          <StatBox characterId={character.id} label="CON" stat="Constitution" value={character.stats.constitution} additionalValue={getAdditionalValue("Constitution")} />
          <StatBox characterId={character.id} label="INT" stat="Intelligence" value={character.stats.intelligence} additionalValue={getAdditionalValue("Intelligence")} />
          <StatBox characterId={character.id} label="WIS" stat="Wisdom" value={character.stats.wisdom} additionalValue={getAdditionalValue("Wisdom")} />
          <StatBox characterId={character.id} label="CHA" stat="Charisma" value={character.stats.charisma} additionalValue={getAdditionalValue("Charisma")} />
        </div>
      </div>

      {/* Items Section */}
      {character.itemsAffectingStats.length > 0 && (
        <div className={styles.characterCardSection}>
          <Title level={3} id={`${character.id}-items-label`}>Magic Items</Title>
          <div className={styles.characterCardItems} role="list" aria-labelledby={`${character.id}-items-label`}>
            {character.itemsAffectingStats.map((item, index) => (
              <div key={index} className={styles.characterCardItem} role="listitem">
                <div className={styles.characterCardItemName}>{item.name}</div>
                <div className={styles.characterCardItemModifier} aria-label={`Grants +${item.modifierValue} to ${item.modifierStat}`}>
                  +{item.modifierValue} {item.modifierStat}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Defenses Section */}
      {character.defenses && character.defenses.length > 0 && (
        <div className={styles.characterCardSection}>
          <Title level={3} id={`${character.id}-defenses-label`}>Defenses</Title>
          <div className={styles.characterCardDefenses} aria-labelledby={`${character.id}-defenses-label`}>
            {character.defenses.filter(d => d.defense.toLowerCase() === 'immunity').length > 0 && (
              <div className={styles.characterCardDefenseRow} role="list" aria-label="Damage immunities">
                <span className={styles.characterCardDefenseLabel}>Immunity:</span>
                <div className={styles.characterCardDefenseTags}>
                  {character.defenses
                    .filter(d => d.defense.toLowerCase() === 'immunity')
                    .map((defense, index) => (
                      <Tag key={index} color="gold" role="listitem" aria-label={`Immune to ${defense.type}`}>{defense.type}</Tag>
                    ))}
                </div>
              </div>
            )}
            {character.defenses.filter(d => d.defense.toLowerCase() === 'resistance').length > 0 && (
              <div className={styles.characterCardDefenseRow} role="list" aria-label="Damage resistances">
                <span className={styles.characterCardDefenseLabel}>Resistance:</span>
                <div className={styles.characterCardDefenseTags}>
                  {character.defenses
                    .filter(d => d.defense.toLowerCase() === 'resistance')
                    .map((defense, index) => (
                      <Tag key={index} color="cyan" role="listitem" aria-label={`Resistant to ${defense.type}`}>{defense.type}</Tag>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

function StatBox({ characterId, label, stat, value, additionalValue }: { characterId: string; label: string; stat: string; value: number, additionalValue: number }) {
  const totalValue = value + additionalValue;
  const ariaLabel = additionalValue > 0 
    ? `${stat}: ${totalValue} (base ${value} plus ${additionalValue} bonus)` 
    : `${stat}: ${totalValue}`;
  
  return (
    <div className={styles.characterCardStatBox} role="listitem">
      <div className={styles.characterCardStatLabel} id={`${characterId}-${label}-label`}>{label}</div>
      <Tooltip trigger={['hover', 'focus']} title={`${stat}: ${value} ${additionalValue > 0 ? `| Additional: ${additionalValue}` : ''}`}>
          <div 
            className={`${styles.characterCardStatValue} ${additionalValue > 0 ? styles.characterCardStatValueBonus : ''}`}
            aria-labelledby={`${characterId}-${label}-label`}
            aria-label={ariaLabel}
            tabIndex={0}
          >
            {totalValue}
          </div>
        </Tooltip>
    </div>
  );
}
