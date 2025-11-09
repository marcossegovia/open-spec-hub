import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadAllSpecs } from '@/lib/loaders/spec-loader';
import OperationDetail from '@/components/unified/OperationDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ThemeToggleWrapper from '@/components/theme-toggle-wrapper';
import { UnifiedContract, UnifiedOperation } from '@/lib/normalization/unified-model';

interface PageProps {
  params: {
    operationId: string;
  };
}

export default async function OperationPage({ params }: PageProps) {
  const { operationId } = params;

  // Load all contracts
  const contracts = await loadAllSpecs();

  // Find operation across all contracts
  let foundOperation = null;
  let foundContract = null;

  for (const contract of contracts) {
    const operation = contract.operations.find(op => op.id === operationId);
    if (operation) {
      foundOperation = operation;
      foundContract = contract;
      break;
    }
  }

  // If not found, show 404
  if (!foundOperation || !foundContract) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb and Back Button */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Operations
            </Button>
          </Link>
          <div className="w-32">
            <ThemeToggleWrapper />
          </div>
        </div>

        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/" className="hover:text-foreground">
                All Operations
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{foundOperation.name}</li>
          </ol>
        </nav>
      </div>

      {/* Operation Detail */}
      <OperationDetail operation={foundOperation} contract={foundContract} />
    </div>
  );
}

// Generate static params for all operations (for SSG)
export async function generateStaticParams() {
  const contracts = await loadAllSpecs();
  const params: { operationId: string }[] = [];

  for (const contract of contracts) {
    for (const operation of contract.operations) {
      params.push({
        operationId: operation.id,
      });
    }
  }

  return params;
}

// Generate metadata for each operation page
export async function generateMetadata({ params }: PageProps) {
  const { operationId } = params;
  const contracts = await loadAllSpecs();

  let foundOperation = null;
  let foundContract = null;

  for (const contract of contracts) {
    const operation = contract.operations.find(op => op.id === operationId);
    if (operation) {
      foundOperation = operation;
      foundContract = contract;
      break;
    }
  }

  if (!foundOperation || !foundContract) {
    return {
      title: 'Operation Not Found',
    };
  }

  return {
    title: `${foundOperation.name} - ${foundContract.name}`,
    description: foundOperation.description || `${foundOperation.actionType} operation at ${foundOperation.location}`,
  };
}