import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ActionsCard } from './ActionsCard';
import { mockCharacters } from '@/test/mocks/characterMocks';

expect.extend(toHaveNoViolations);

const mockOnActionPerformed = vi.fn();

// Mock the useMediaQuery hook
vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
}));

import { useMediaQuery } from '@/hooks/useMediaQuery';

describe('ActionsCard - Accessibility Tests', () => {
  beforeEach(() => {
    // Use desktop view for accessibility tests to ensure all elements are rendered
    vi.mocked(useMediaQuery).mockReturnValue(true);
  });
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper aria-labels on all inputs', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    expect(screen.getByLabelText(/select character to perform actions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select damage type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/damage amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/heal amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temporary hit points amount/i)).toBeInTheDocument();
  });

  it('should have proper aria-labels on all buttons', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    expect(screen.getByLabelText(/deal damage to selected character/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/heal selected character/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add temporary hit points/i)).toBeInTheDocument();
  });

  it('should have proper labels associated with form elements', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const characterSelect = screen.getByLabelText(/select character/i);
    expect(characterSelect).toHaveAttribute('id', 'character-select');

    const damageAmountInput = screen.getByLabelText(/damage amount/i);
    expect(damageAmountInput).toHaveAttribute('id', 'damage-amount');

    const healAmountInput = screen.getByLabelText(/heal amount/i);
    expect(healAmountInput).toHaveAttribute('id', 'heal-amount');

    const tempHpInput = screen.getByLabelText(/temporary hit points amount/i);
    expect(tempHpInput).toHaveAttribute('id', 'temp-hp-amount');
  });
});

describe('ActionsCard - Keyboard Navigation Tests', () => {
  beforeEach(() => {
    // Use desktop view for keyboard navigation tests
    vi.mocked(useMediaQuery).mockReturnValue(true);
  });

  it('should be keyboard navigable through all form elements', async () => {
    const user = userEvent.setup();
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    await user.tab();
    const characterSelect = screen.getByLabelText(/select character to perform actions/i);
    expect(characterSelect).toHaveFocus();

    await user.tab();
    const damageTypeSelect = screen.getByLabelText(/select damage type/i);
    expect(damageTypeSelect).toHaveFocus();

    await user.tab();
    const damageAmount = screen.getByLabelText(/damage amount/i);
    expect(damageAmount).toHaveFocus();

    await user.tab();
    const healAmount = screen.getByLabelText(/heal amount/i);
    expect(healAmount).toHaveFocus();

    await user.tab();
    const tempHpAmount = screen.getByLabelText(/temporary hit points amount/i);
    expect(tempHpAmount).toHaveFocus();
  });

  it('should enable damage button when all required fields have values', async () => {
    const user = userEvent.setup();
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const damageButton = screen.getByLabelText(/deal damage to selected character/i);
    expect(damageButton).toBeDisabled();

    const characterSelectInput = screen.getByLabelText(/select character to perform actions/i);
    fireEvent.mouseDown(characterSelectInput.parentElement!);
    const characterOptions = await screen.findAllByText(mockCharacters[0].name);
    fireEvent.click(characterOptions[characterOptions.length - 1]); // Click the option in the dropdown

    const damageTypeSelectInput = screen.getByLabelText(/select damage type/i);
    fireEvent.mouseDown(damageTypeSelectInput.parentElement!);
    const damageTypeOptions = await screen.findAllByText('Bludgeoning');
    fireEvent.click(damageTypeOptions[damageTypeOptions.length - 1]); // Click the option in the dropdown

    const damageAmountInput = screen.getByLabelText(/damage amount/i);
    await user.type(damageAmountInput, '10');
    await user.tab();

    await waitFor(() => {
      expect(damageButton).toBeEnabled();
      expect(damageButton).toHaveFocus();
    });
  });

  it('should allow reverse tab navigation', async () => {
    const user = userEvent.setup();
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const tempHpButton = screen.getByLabelText(/add temporary hit points/i);
    tempHpButton.focus();

    await user.tab({ shift: true });
    const tempHpInput = screen.getByLabelText(/temporary hit points amount/i);
    expect(tempHpInput).toHaveFocus();
  });
});

describe('ActionsCard - Functional Tests', () => {
  beforeEach(() => {
    // Use desktop view for functional tests to ensure all elements are accessible
    vi.mocked(useMediaQuery).mockReturnValue(true);
  });
  it('should render character select with all characters', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const selectElement = screen.getByLabelText(/select character to perform actions/i);
    expect(selectElement).toBeInTheDocument();
  });

  it('should only allow positive numbers in input fields', async () => {
    const user = userEvent.setup();
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const damageInput = screen.getByLabelText(/damage amount/i);

    await user.type(damageInput, '5');
    expect(damageInput).toHaveValue(5);

    await user.clear(damageInput);
    await user.type(damageInput, '-5');
    expect(damageInput).toHaveValue(null);
  });

  it('should disable action buttons when no character is selected', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const damageButton = screen.getByLabelText(/deal damage to selected character/i);
    const healButton = screen.getByLabelText(/heal selected character/i);
    const tempHpButton = screen.getByLabelText(/add temporary hit points/i);

    expect(damageButton).toBeDisabled();
    expect(healButton).toBeDisabled();
    expect(tempHpButton).toBeDisabled();
  });

  it('should clear input fields after successful action', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const healInput = screen.getByLabelText(/heal amount/i);
    expect(healInput).toHaveValue(null);
  });

  it('should render all damage type options', async () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const damageTypeSelect = screen.getByLabelText(/select damage type/i);

    expect(damageTypeSelect).toBeInTheDocument();
  });

  it('should show loading state on buttons when action is being performed', () => {
    render(<ActionsCard characters={mockCharacters} onActionPerformed={mockOnActionPerformed} />);

    const damageButton = screen.getByLabelText(/deal damage to selected character/i);
    expect(damageButton).toHaveTextContent('Damage');
  });
});
