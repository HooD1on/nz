import { notFound } from 'next/navigation';
import DestinationPage from '../../../components/destination/DestinationPage';
import { destinationService } from '../../../services/destinationService';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const awaitedParams = await params;
  const [destination, packages] = await Promise.all([
    destinationService.getDestinationById(awaitedParams.id),
    destinationService.getRelatedPackages(awaitedParams.id)
  ]);

  if (!destination) {
    notFound();
  }

  return (
    <DestinationPage
      destination={destination}
      relatedPackages={packages}
    />
  );
} 