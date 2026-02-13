import { useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectGroup, SelectLabel, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DamageType, type Character } from '@/types/character';
import { Button } from '@/components/ui/button';
import { characterService } from '@/services/characterService';

export const ActionsCard = ({ characters }: { characters: Character[] }) => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const [damageType, setDamageType] = useState<DamageType>(DamageType.Slashing);
    const [damageAmount, setDamageAmount] = useState<string>('');
    const [healAmount, setHealAmount] = useState<string>('');
    const [tempHpAmount, setTempHpAmount] = useState<string>('');
    const [loading, setLoading] = useState<string | null>(null);

    const handleDealDamage = async () => {
        if (!selectedCharacterId || !damageAmount) return;
        
        setLoading('damage');
        try {
            await characterService.dealDamage(selectedCharacterId, damageType, Number(damageAmount));
            setDamageAmount('');
        } catch (error) {
            console.error('Failed to deal damage:', error);
        } finally {
            setLoading(null);
        }
    };

    const handleHeal = async () => {
        if (!selectedCharacterId || !healAmount) return;
        
        setLoading('heal');
        try {
            await characterService.heal(selectedCharacterId, Number(healAmount));
            setHealAmount('');
        } catch (error) {
            console.error('Failed to heal character:', error);
        } finally {
            setLoading(null);
        }
    };

    const handleAddTempHp = async () => {
        if (!selectedCharacterId || !tempHpAmount) return;
        
        setLoading('tempHp');
        try {
            await characterService.addTemporaryHitPoints(selectedCharacterId, Number(tempHpAmount));
            setTempHpAmount('');
        } catch (error) {
            console.error('Failed to add temporary hit points:', error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <Card className="w-full max-w-2xl mb-8 mx-auto">
            <CardContent >
                <div className='grid grid-rows-2 gap-2'>
                    <div className='flex items-center gap-4'>
                        <Field>
                            <FieldLabel>Select Character</FieldLabel>
                            <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select character" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Character Name</SelectLabel>
                                    {characters.map((character: Character) => (
                                        <SelectItem key={character.id} value={character.id}>{character.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        </Field>
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                        <Field>
                            <FieldLabel>Deal Damage</FieldLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <Select value={damageType} onValueChange={(value) => setDamageType(value as DamageType)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Damage Type</SelectLabel>
                                            {Object.values(DamageType).map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input 
                                    type="number" 
                                    placeholder="Amount" 
                                    value={damageAmount}
                                    onChange={(e) => setDamageAmount(e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="outline" 
                                className='hover:bg-red-800 hover:text-red-200'
                                onClick={handleDealDamage}
                                disabled={!selectedCharacterId || !damageAmount || loading === 'damage'}
                            >
                                {loading === 'damage' ? 'Dealing...' : 'Damage'}
                            </Button>
                        </Field>
                        <Field>
                            <FieldLabel>Heal</FieldLabel>
                            <Input 
                                type="number" 
                                placeholder="Amount" 
                                value={healAmount}
                                onChange={(e) => setHealAmount(e.target.value)}
                            />
                            <Button 
                                variant="outline" 
                                className='hover:bg-green-800 hover:text-green-200'
                                onClick={handleHeal}
                                disabled={!selectedCharacterId || !healAmount || loading === 'heal'}
                            >
                                {loading === 'heal' ? 'Healing...' : 'Heal'}
                            </Button>
                        </Field>
                        <Field>
                            <FieldLabel>Temporary Hit Points</FieldLabel>
                            <Input 
                                type="number" 
                                placeholder="Amount" 
                                value={tempHpAmount}
                                onChange={(e) => setTempHpAmount(e.target.value)}
                            />
                            <Button 
                                variant="outline" 
                                className='hover:bg-sky-950 hover:text-sky-300'
                                onClick={handleAddTempHp}
                                disabled={!selectedCharacterId || !tempHpAmount || loading === 'tempHp'}
                            >
                                {loading === 'tempHp' ? 'Adding...' : 'Add'}
                            </Button>
                        </Field>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
