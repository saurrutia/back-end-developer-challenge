import type { Character } from '../types/character';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const hpPercentage = (character.currentHitPoints / character.hitPoints) * 100;
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{character.name}</CardTitle>
        <CardDescription>
          {character.classes.join(', ') || 'Unknown'} • Level {character.level}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Hit Points Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Hit Points</h3>
            <span className="text-sm font-medium">
              {character.currentHitPoints}/{character.hitPoints}
            </span>
          </div>
          <Progress value={hpPercentage} className="h-3" />
          
          {character.temporaryHitPoints > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm text-muted-foreground">Temporary HP:</span>
              <Badge variant="secondary">{character.temporaryHitPoints}</Badge>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Ability Scores</h3>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="STR" value={character.stats.strength} additionalValue={character.itemsAffectingStats.filter(i => i.modifierStat == "strength").reduce((acc, item) => acc + item.modifierValue, 0)} />
            <StatBox label="DEX" value={character.stats.dexterity} additionalValue={character.itemsAffectingStats.filter(i => i.modifierStat == "dexterity").reduce((acc, item) => acc + item.modifierValue, 0)} />
            <StatBox label="CON" value={character.stats.constitution} additionalValue={character.itemsAffectingStats.filter(i => i.modifierStat == "constitution").reduce((acc, item) => acc + item.modifierValue, 0)} />
            <StatBox label="INT" value={character.stats.intelligence} additionalValue={character.itemsAffectingStats.filter(i => i.modifierStat == "intelligence").reduce((acc, item) => acc + item.modifierValue, 0)} />
            <StatBox label="WIS" value={character.stats.wisdom} additionalValue={character.itemsAffectingStats.filter(i => i.modifierStat == "wisdom").reduce((acc, item) => acc + item.modifierValue, 0)} />
            <StatBox label="CHA" value={character.stats.charisma} additionalValue={character.itemsAffectingStats.filter(i => i.modifierStat == "charisma").reduce((acc, item) => acc + item.modifierValue, 0)} />
          </div>
        </div>

        {/* Items Section */}
        {character.itemsAffectingStats.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Magic Items</h3>
            <div className="space-y-2">
              {character.itemsAffectingStats.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-muted/50 p-3 text-sm"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs mt-1">
                    +{item.modifierValue} {item.modifierStat}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function StatBox({ label, value, additionalValue }: { label: string; value: number, additionalValue: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-3">
      <div className="text-xs font-medium text-muted-foreground mb-1">
        {label}
      </div>
      { additionalValue > 0 ? (
        <Tooltip>
          <TooltipTrigger>
            <div className="text-2xl font-bold text-green-600">
              {value + additionalValue}
            </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Base: {value}</p>
          {additionalValue > 0 && <p>Additional: {additionalValue}</p>}
        </TooltipContent>
      </Tooltip>
      ) : (
        <div className="text-2xl font-bold">
          {value}
        </div>
      )}
      
    </div>
  );
}
