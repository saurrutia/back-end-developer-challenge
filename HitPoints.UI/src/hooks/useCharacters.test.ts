import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCharacters } from './useCharacters';
import { characterService } from '@/services/characterService';
import { mockCharacters } from '@/test/mocks/characterMocks';

vi.mock('@/services/characterService', () => ({
  characterService: {
    getAllCharacters: vi.fn(),
  },
}));

describe('useCharacters Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load characters on mount', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    const { result } = renderHook(() => useCharacters());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.characters).toEqual(mockCharacters);
    expect(result.current.error).toBeNull();
  });

  it('should handle error when loading characters fails', async () => {
    const errorMessage = 'Failed to load characters';
    vi.mocked(characterService.getAllCharacters).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useCharacters());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.characters).toEqual([]);
  });

  it('should reload characters when reload is called', async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(mockCharacters);
    
    const { result } = renderHook(() => useCharacters());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.characters).toEqual(mockCharacters);
    
    vi.mocked(characterService.getAllCharacters).mockResolvedValue([mockCharacters[0]]);
    
    act(() => {
      result.current.reload();
    });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.characters).toEqual([mockCharacters[0]]);
  });
});
