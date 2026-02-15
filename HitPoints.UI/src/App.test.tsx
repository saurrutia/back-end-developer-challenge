import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './App';
import { characterService } from '@/services/characterService';
import { mockCharacters } from '@/test/mocks/characterMocks';

expect.extend(toHaveNoViolations);

vi.mock('@/services/characterService', () => ({
  characterService: {
    getAllCharacters: vi.fn(),
  },
}));

describe('App - Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not have accessibility violations', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    const { container } = render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading characters/i)).not.toBeInTheDocument();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000);

  it('should have proper heading hierarchy', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading characters/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('D&D Character Manager')).toBeInTheDocument();
  });

  it('should announce loading state to screen readers', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    const loadingContainer = screen.getByRole('status');
    expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
    
    // Wait for loading to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.queryByText(/loading characters/i)).not.toBeInTheDocument();
    });
  });

  it('should announce errors to screen readers', async () => {
    vi.mocked(characterService.getAllCharacters).mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
    });
  });

  it('should have proper aria-label on retry button', async () => {
    vi.mocked(characterService.getAllCharacters).mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      const retryButton = screen.getByLabelText(/retry loading characters/i);
      expect(retryButton).toBeInTheDocument();
    });
  });
});

describe('App - Functional Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('should render characters after loading', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Briv')).toBeInTheDocument();
      expect(screen.getByText('Elara')).toBeInTheDocument();
      expect(screen.getByText('Thorgrim')).toBeInTheDocument();
    });
  });

  it('should render error state when loading fails', async () => {
    const errorMessage = 'Network error';
    vi.mocked(characterService.getAllCharacters).mockRejectedValue(new Error(errorMessage));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(`${errorMessage}`)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('should show "No characters found" when list is empty', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue([]);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument();
    });
  });

  it('should render the actions card', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/character actions/i)).toBeInTheDocument();
    });
  });

  it('should render character cards in a list', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    await waitFor(() => {
      const characterList = screen.getByLabelText(/character cards/i);
      expect(characterList).toBeInTheDocument();
      expect(characterList).toHaveAttribute('role', 'list');
    });
  });

  it('should render the correct number of character cards', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    await waitFor(() => {
      const cards = screen.queryAllByTestId(/^card-/);
      expect(cards).toHaveLength(mockCharacters.length);
    });
  });

  it('should render main title', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    render(<App />);
    
    const title = screen.getByRole('banner');
    await waitFor(() => {
      expect(title).toHaveTextContent('D&D Character Manager');
    });
  });
});
