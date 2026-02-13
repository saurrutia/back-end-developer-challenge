import { useState } from 'react';
import { Card, Select, Input, Button, Form, Space } from 'antd';
import { DamageType, type Character } from '@/types/character';
import { characterService } from '@/services/characterService';
import './ActionsCard.css';

const { Option } = Select;

interface ActionsCardProps {
    characters: Character[];
    onActionPerformed?: (characterId: string, actionType: 'damage' | 'heal' | 'tempHp') => void;
}

export const ActionsCard = ({ characters, onActionPerformed }: ActionsCardProps) => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const [damageType, setDamageType] = useState<DamageType | undefined>(undefined);
    const [damageAmount, setDamageAmount] = useState<string>('');
    const [healAmount, setHealAmount] = useState<string>('');
    const [tempHpAmount, setTempHpAmount] = useState<string>('');
    const [loading, setLoading] = useState<string | null>(null);

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
            onActionPerformed?.(selectedCharacterId, 'damage');
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

    return (
        <Card className="actions-card">
            <Form layout="vertical">
                <Form.Item label="Select Character">
                    <Select 
                        placeholder="Select character"
                        value={selectedCharacterId || undefined}
                        onChange={setSelectedCharacterId}
                    >
                        {characters.map((character: Character) => (
                            <Option key={character.id} value={character.id}>
                                {character.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <div className="actions-grid">
                    {/* Deal Damage */}
                    <div className="action-section">
                        <Form.Item label="Deal Damage">
                            <Space.Compact style={{ width: '100%' }}>
                                <Select 
                                    placeholder="Type"
                                    value={damageType}
                                    onChange={setDamageType}
                                    style={{ width: '50%' }}
                                >
                                    {Object.values(DamageType).map((type) => (
                                        <Option key={type} value={type}>{type}</Option>
                                    ))}
                                </Select>
                                <Input 
                                    type="number" 
                                    placeholder="Amount" 
                                    value={damageAmount}
                                    onChange={(e) => handleNumberInput(e.target.value, setDamageAmount)}
                                    min={1}
                                    style={{ width: '50%' }}
                                />
                            </Space.Compact>
                        </Form.Item>
                        <Button 
                            type="primary"
                            danger
                            onClick={handleDealDamage}
                            disabled={!selectedCharacterId || !damageAmount || loading === 'damage'}
                            loading={loading === 'damage'}
                            block
                        >
                            {loading === 'damage' ? 'Dealing...' : 'Damage'}
                        </Button>
                    </div>

                    {/* Heal */}
                    <div className="action-section">
                        <Form.Item label="Heal">
                            <Input 
                                type="number" 
                                placeholder="Amount" 
                                value={healAmount}
                                onChange={(e) => handleNumberInput(e.target.value, setHealAmount)}
                                min={1}
                            />
                        </Form.Item>
                        <Button 
                            type="primary"
                            className="heal-button"
                            onClick={handleHeal}
                            disabled={!selectedCharacterId || !healAmount || loading === 'heal'}
                            loading={loading === 'heal'}
                            block
                        >
                            {loading === 'heal' ? 'Healing...' : 'Heal'}
                        </Button>
                    </div>

                    {/* Temporary Hit Points */}
                    <div className="action-section">
                        <Form.Item label="Temporary Hit Points">
                            <Input 
                                type="number" 
                                placeholder="Amount" 
                                value={tempHpAmount}
                                onChange={(e) => handleNumberInput(e.target.value, setTempHpAmount)}
                                min={1}
                            />
                        </Form.Item>
                        <Button 
                            type="primary"
                            className="temp-hp-button"
                            onClick={handleAddTempHp}
                            disabled={!selectedCharacterId || !tempHpAmount || loading === 'tempHp'}
                            loading={loading === 'tempHp'}
                            block
                        >
                            {loading === 'tempHp' ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </div>
            </Form>
        </Card>
    );
};
