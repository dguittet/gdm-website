import { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export interface Field {
  name: string;
  sql_type: string;
  python_type?: string;
  nullable: boolean;
  required: boolean;
  description?: string;
  constraints: string[];
  default_value?: string;
  is_primary_key: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  table: string;
  class?: string;
  description: string;
  fields: Field[];
  field_count: number;
}

export interface SchemaData {
  datasets: Dataset[];
  dataset_count: number;
  generated_at: string;
}

export function useSchemaData() {
  const [data, setData] = useState<SchemaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const schemaUrl = useBaseUrl('/data/schema.json');

  useEffect(() => {
    fetch(schemaUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load schema: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [schemaUrl]);

  return { data, loading, error };
}
