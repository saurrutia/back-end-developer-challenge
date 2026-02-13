import type { Character } from '../../types/character';
import { Card, Progress, Tag, Tooltip } from 'antd';
import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
  highlightType?: 'damage' | 'heal' | 'tempHp' | null;
}

export const CharacterCard = ({ character, highlightType }: CharacterCardProps) => {
  const hpPercentage = (character.currentHitPoints / character.hitPoints) * 100;

  const getHighlightClass = () => {
    if (!highlightType) return '';
    switch (highlightType) {
      case 'damage':
        return 'character-card-highlight-damage';
      case 'heal':
        return 'character-card-highlight-heal';
      case 'tempHp':
        return 'character-card-highlight-temphp';
      default:
        return '';
    }
  };

  const getProgressStatus = () => {
    if (hpPercentage > 50) return 'success';
    if (hpPercentage > 25) return 'normal';
    return 'exception';
  };

  const getAdditionalValue = (stat: string) => {
    return character.itemsAffectingStats
      .filter(item => item.modifierStat.toLowerCase() === stat.toLowerCase())
      .reduce((acc, item) => acc + item.modifierValue, 0);
  }

  return (
    <Card
      className={`character-card ${getHighlightClass()}`}
      title={character.name}
      extra={
        <span style={{ fontSize: '14px', color: '#888' }}>
          {character.classes.join(', ') || 'Unknown'} • Level {character.level}
        </span>
      }
    >
      {/* Hit Points Section */}
      <div className="character-card-section">
        <div className="character-card-hp-header">
          <h3>Hit Points</h3>
          <span>
            {character.currentHitPoints}/{character.hitPoints}
          </span>
        </div>
        <Progress
          percent={hpPercentage}
          status={getProgressStatus()}
          showInfo={false}
        />

        {character.temporaryHitPoints > 0 && (
          <div className="character-card-temp-hp">
            <span>Temporary HP:</span>
            <Tag color="blue">{character.temporaryHitPoints}</Tag>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="character-card-section">
        <h3>Ability Scores</h3>
        <div className="character-card-stats-grid">
          <StatBox label="STR" stat="Strength" value={character.stats.strength} additionalValue={getAdditionalValue("Strength")} />
          <StatBox label="DEX" stat="Dexterity" value={character.stats.dexterity} additionalValue={getAdditionalValue("Dexterity")} />
          <StatBox label="CON" stat="Constitution" value={character.stats.constitution} additionalValue={getAdditionalValue("Constitution")} />
          <StatBox label="INT" stat="Intelligence" value={character.stats.intelligence} additionalValue={getAdditionalValue("Intelligence")} />
          <StatBox label="WIS" stat="Wisdom" value={character.stats.wisdom} additionalValue={getAdditionalValue("Wisdom")} />
          <StatBox label="CHA" stat="Charisma" value={character.stats.charisma} additionalValue={getAdditionalValue("Charisma")} />
        </div>
      </div>

      {/* Items Section */}
      {character.itemsAffectingStats.length > 0 && (
        <div className="character-card-section">
          <h3>Magic Items</h3>
          <div className="character-card-items">
            {character.itemsAffectingStats.map((item, index) => (
              <div key={index} className="character-card-item">
                <div className="character-card-item-name">{item.name}</div>
                <div className="character-card-item-modifier">
                  +{item.modifierValue} {item.modifierStat}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

function StatBox({ label, stat, value, additionalValue }: { label: string; stat: string; value: number, additionalValue: number }) {
  return (
    <div className="character-card-stat-box">
      <div className="character-card-stat-label">{label}</div>
      <Tooltip title={`${stat}: ${value} ${additionalValue > 0 ? `| Additional: ${additionalValue}` : ''}`}>
          <div className={`character-card-stat-value ${additionalValue > 0 ? 'character-card-stat-value-bonus' : ''}`}>
            {value + additionalValue}
          </div>
        </Tooltip>
    </div>
  );
}
