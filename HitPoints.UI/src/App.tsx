import { CharacterCard } from './components/CharacterCard';
import { ActionsCard } from './components/ActionsCard';
import { useCharacters } from './hooks/useCharacters';

function App() {
  const { characters, loading, error, reload } = useCharacters();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">D&D Character Manager</h1>
          <div className="text-center text-muted-foreground">Loading characters...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">D&D Character Manager</h1>
          <div className="max-w-md mx-auto rounded-lg border bg-destructive/10 p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={reload}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">D&D Character Manager</h1>
        <ActionsCard characters={characters} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {characters.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">No characters found</p>
          ) : (
            characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
