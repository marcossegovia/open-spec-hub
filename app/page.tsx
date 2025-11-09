import { loadAllSpecs } from '@/lib/loaders/spec-loader';
import ContractExplorer from '@/components/unified/ContractExplorer';

export default async function Home() {
  const contracts = await loadAllSpecs();

  if (contracts.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Unified API Documentation Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Protocol-agnostic documentation for REST and event-driven APIs
          </p>
          <p className="text-sm text-muted-foreground mt-8">
            No API specifications found. Add OpenAPI or AsyncAPI specs to the specs/ directory.
          </p>
        </div>
      </main>
    );
  }

  return <ContractExplorer contracts={contracts} />;
}
