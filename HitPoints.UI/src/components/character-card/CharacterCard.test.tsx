import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CharacterCard } from './CharacterCard';
import { mockCharacter, mockCharacterFullHealth, mockCharacterLowHealth } from '@/test/mocks/characterMocks';

expect.extend(toHaveNoViolations);

describe('CharacterCard - Accessibility Tests', () => {

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <div role="list"><CharacterCard character={mockCharacter} /></div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper aria-label for character card', () => {
    render(<CharacterCard character={mockCharacter} />);
    expect(screen.getByLabelText(/character card for briv/i)).toBeInTheDocument();
  });

  it('should have proper aria-label for hit points progress', () => {
    render(<CharacterCard character={mockCharacter} />);
    expect(screen.getByLabelText(/hit points: 20 out of 25/i)).toBeInTheDocument();
  });

  it('should have proper semantic heading structure', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByRole('heading', { name: /hit points/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ability scores/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /magic items/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /defenses/i })).toBeInTheDocument();
  });

  it('should have proper aria-labels for ability stats', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByLabelText(/strength: 15/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dexterity: 12/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/constitution: 16/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/intelligence: 13/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wisdom: 10/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/charisma: 8/i)).toBeInTheDocument();
  });

  it('should have focusable stats with tabindex', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    const strengthStat = screen.getByLabelText(/strength: 15/i);
    expect(strengthStat).toHaveAttribute('tabIndex', '0');
  });

  it('should announce defenses to screen readers', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByLabelText(/immune to fire/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/resistant to slashing/i)).toBeInTheDocument();
  });

  it('should have proper aria-label for temporary hit points', () => {
    render(<CharacterCard character={mockCharacter} />);
    expect(screen.getByLabelText(/5 temporary hit points/i)).toBeInTheDocument();
  });
});

describe('CharacterCard - Functional Tests', () => {
  it('should render character name and level', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('Briv')).toBeInTheDocument();
    expect(screen.getByText(/fighter • level 5/i)).toBeInTheDocument();
  });

  it('should display current and max hit points', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('20/25')).toBeInTheDocument();
  });

  it('should show temporary hit points when present', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('Temporary HP:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should not show temporary hit points when zero', () => {
    render(<CharacterCard character={mockCharacterFullHealth} />);
    
    expect(screen.queryByText('Temporary HP:')).not.toBeInTheDocument();
  });

  it('should display all ability scores correctly', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('STR')).toBeInTheDocument();
    expect(screen.getByText('DEX')).toBeInTheDocument();
    expect(screen.getByText('CON')).toBeInTheDocument();
    expect(screen.getByText('INT')).toBeInTheDocument();
    expect(screen.getByText('WIS')).toBeInTheDocument();
    expect(screen.getByText('CHA')).toBeInTheDocument();
  });

  it('should display magic items when present', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('Ioun Stone of Fortitude')).toBeInTheDocument();
    expect(screen.getByText(/\+2 constitution/i)).toBeInTheDocument();
  });

  it('should not show magic items section when no items', () => {
    render(<CharacterCard character={mockCharacterFullHealth} />);
    
    expect(screen.queryByText('Magic Items')).not.toBeInTheDocument();
  });

  it('should display defenses when present', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Slashing')).toBeInTheDocument();
  });

  it('should not show defenses section when no defenses', () => {
    render(<CharacterCard character={mockCharacterFullHealth} />);
    
    expect(screen.queryByText('Defenses')).not.toBeInTheDocument();
  });

  it('should calculate correct HP percentage for full health', () => {
    render(<CharacterCard character={mockCharacterFullHealth} />);
    
    expect(screen.getByText('20/20')).toBeInTheDocument();
  });

  it('should calculate correct HP percentage for low health', () => {
    render(<CharacterCard character={mockCharacterLowHealth} />);
    
    expect(screen.getByText('10/50')).toBeInTheDocument();
  });

  it('should apply highlight class when highlightType is provided', () => {
    const { container } = render(<CharacterCard character={mockCharacter} highlightType="damage" />);
    
    const card = container.querySelector('[class*="characterCardHighlightDamage"]');
    expect(card).toBeInTheDocument();
  });

  it('should handle multiple classes correctly', () => {
    const multiClassCharacter = {
      ...mockCharacter,
      classes: ['fighter', 'wizard'],
    };
    
    render(<CharacterCard character={multiClassCharacter} />);
    expect(screen.getByText(/fighter, wizard • level 5/i)).toBeInTheDocument();
  });

  it('should show ability score bonuses from items', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    const constitutionValue = screen.getByLabelText(/constitution: 16/i);
    expect(constitutionValue).toBeInTheDocument();
  });
});
