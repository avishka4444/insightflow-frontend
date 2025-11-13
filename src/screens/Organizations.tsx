import { useQuery } from '@tanstack/react-query';
import { organizationService, type Organization } from '../services/OrganizationsService';

/**
 * Organizations component demonstrating how to use the API architecture with React Query
 */
export default function Organizations() {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'object') {
      const maybeOid = (value as { $oid?: string; timestamp?: number; date?: string }).$oid;
      if (maybeOid) return maybeOid;
      if (value instanceof Date) return value.toISOString();
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Fetching organizations with useQuery
  const {
    data: organizations,
    isFetching: isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [organizationService.getAll.name],
    queryFn: () => organizationService.getAll(),
  });

  if (isLoading) {
    return <div>Loading organizations...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || 'Failed to load organizations'}</div>;
  }

  return (
    <div>
      <h1>Organizations</h1>
      {organizations && organizations.length > 0 && (
        <ul>
          {organizations.map((organization: Organization) => (
            <li key={formatValue(organization.id)}>
              {organization.name} - Plan: {formatValue(organization.plan)} - Owner: {formatValue(organization.ownerId)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

