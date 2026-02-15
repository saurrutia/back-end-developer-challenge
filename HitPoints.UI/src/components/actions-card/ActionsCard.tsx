import { useState } from 'react';
import { Card, Select, Input, Button, Form, Space, Tabs } from 'antd';
import { DamageType, type Character } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './ActionsCard.module.css';

const { Option } = Select;

interface ActionsCardProps {
    characters: Character[];
    onActionPerformed?: (characterId: string, actionType: 'damage' | 'heal' | 'tempHp', damageType?: DamageType) => void;
    onCharacterSelect?: (characterId: string) => void;
}

export const ActionsCard = ({ characters, onActionPerformed, onCharacterSelect }: ActionsCardProps) => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const [damageType, setDamageType] = useState<DamageType | undefined>(undefined);
    const [damageAmount, setDamageAmount] = useState<string>('');
    const [healAmount, setHealAmount] = useState<string>('');
    const [tempHpAmount, setTempHpAmount] = useState<string>('');
    const [loading, setLoading] = useState<string | null>(null);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const handleCharacterSelect = (characterId: string) => {
        setSelectedCharacterId(characterId);
        onCharacterSelect?.(characterId);
    };

    const handleNumberInput = (value: string, setter: (val: string) => void) => {
        if (value === '' || /^\d+$/.test(value)) {
            setter(value);
        }
    };

    const handleDealDamage = async () => {
        if (!selectedCharacterId || !damageAmount || Number(damageAmount) <= 0 || damageType === undefined) return;
        
        setLoading('damage');
        try {
            await characterService.dealDamage(selectedCharacterId, damageType, Number(damageAmount));
            onActionPerformed?.(selectedCharacterId, 'damage', damageType);
            setDamageAmount('');
        } catch (error) {
            console.error('Failed to deal damage:', error);
        } finally {
            setLoading(null);
        }
    };

    const handleHeal = async () => {
        if (!selectedCharacterId || !healAmount || Number(healAmount) <= 0) return;
        
        setLoading('heal');
        try {
            await characterService.heal(selectedCharacterId, Number(healAmount));
            onActionPerformed?.(selectedCharacterId, 'heal');
            setHealAmount('');
        } catch (error) {
            console.error('Failed to heal character:', error);
        } finally {
            setLoading(null);
        }
    };

    const handleAddTempHp = async () => {
        if (!selectedCharacterId || !tempHpAmount || Number(tempHpAmount) <= 0) return;
        
        setLoading('tempHp');
        try {
            await characterService.addTemporaryHitPoints(selectedCharacterId, Number(tempHpAmount));
            onActionPerformed?.(selectedCharacterId, 'tempHp');
            setTempHpAmount('');
        } catch (error) {
            console.error('Failed to add temporary hit points:', error);
        } finally {
            setLoading(null);
        }
    };

    const damageAction = (
        <div className={styles.actionSection}>
            <Form.Item label="Deal Damage">
                <Space.Compact style={{ width: '100%' }}>
                    <Select 
                        id="damage-type-select"
                        placeholder="Type"
                        value={damageType}
                        onChange={setDamageType}
                        style={{ width: '50%' }}
                        aria-label="Select damage type"
                    >
                        {Object.values(DamageType).map((type) => (
                            <Option role="option" key={type} value={type}>{type}</Option>
                        ))}
                    </Select>
                    <Input 
                        id="damage-amount"
                        type="number" 
                        placeholder="Amount" 
                        value={damageAmount}
                        onChange={(e) => handleNumberInput(e.target.value, setDamageAmount)}
                        min={1}
                        style={{ width: '50%' }}
                        aria-label="Damage amount"
                    />
                </Space.Compact>
            </Form.Item>
            <Button 
                color="danger"
                variant='outlined'
                onClick={handleDealDamage}
                disabled={!selectedCharacterId || !damageAmount || loading === 'damage'}
                loading={loading === 'damage'}
                block
                aria-label="Deal damage to selected character"
            >
                {loading === 'damage' ? 'Dealing...' : 'Damage'}
            </Button>
        </div>
    );

    const healAction = (
        <div className={styles.actionSection}>
            <Form.Item label="Heal" htmlFor="heal-amount">
                <Input 
                    id="heal-amount"
                    type="number" 
                    placeholder="Amount" 
                    value={healAmount}
                    onChange={(e) => handleNumberInput(e.target.value, setHealAmount)}
                    min={1}
                    aria-label="Heal amount"
                />
            </Form.Item>
            <Button 
                color="green"
                variant='outlined'
                onClick={handleHeal}
                disabled={!selectedCharacterId || !healAmount || loading === 'heal'}
                loading={loading === 'heal'}
                block
                aria-label="Heal selected character"
            >
                {loading === 'heal' ? 'Healing...' : 'Heal'}
            </Button>
        </div>
    );

    const tempHpAction = (
        <div className={styles.actionSection}>
            <Form.Item label="Temporary Hit Points" htmlFor="temp-hp-amount">
                <Input 
                    id="temp-hp-amount"
                    type="number" 
                    placeholder="Amount" 
                    value={tempHpAmount}
                    onChange={(e) => handleNumberInput(e.target.value, setTempHpAmount)}
                    min={1}
                    aria-label="Temporary hit points amount"
                />
            </Form.Item>
            <Button 
                color="cyan"
                variant='outlined'
                onClick={handleAddTempHp}
                disabled={!selectedCharacterId || !tempHpAmount || loading === 'tempHp'}
                loading={loading === 'tempHp'}
                block
                aria-label="Add temporary hit points to selected character"
            >
                {loading === 'tempHp' ? 'Adding...' : 'Add'}
            </Button>
        </div>
    );

    return (
        <Card className={styles.actionsCard} role="region" aria-label="Character actions">
            <Form layout="vertical">
                <Form.Item label="Select Character" htmlFor="character-select">
                    <Select 
                        id="character-select"
                        placeholder="Select character"
                        value={selectedCharacterId || undefined}
                        onChange={handleCharacterSelect}
                        aria-label="Select character to perform actions on"
                    >
                        {characters.map((character: Character) => (
                            <Option key={character.id} value={character.id}>
                                {character.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Mobile: Tabs for actions */}
                {!isDesktop && (
                    <div className={styles.mobileActions}>
                        <Tabs
                            defaultActiveKey="damage"
                            items={[
                                { key: 'damage', label: 'Damage', children: damageAction },
                                { key: 'heal', label: 'Heal', children: healAction },
                                { key: 'tempHp', label: 'Temp HP', children: tempHpAction }
                            ]}
                        />
                    </div>
                )}

                {/* Desktop: Grid layout for actions */}
                {isDesktop && (
                    <div className={styles.desktopActions}>
                        <div className={styles.actionsGrid}>
                            {damageAction}
                            {healAction}
                            {tempHpAction}
                        </div>
                    </div>
                )}
            </Form>
        </Card>
    );
};
