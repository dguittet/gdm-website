import React from 'react';
import styles from './styles.module.css';

interface Field {
  name: string;
  sql_type: string;
  python_type?: string;
  nullable: boolean;
  required: boolean;
  description?: string;
  is_primary_key: boolean;
}

interface Dataset {
  id: string;
  name: string;
  table: string;
  class?: string;
  description: string;
  fields: Field[];
  field_count: number;
}

interface Props {
  dataset: Dataset;
  activeField?: string;
  onSelectField: (fieldName: string) => void;
}

export default function DatasetView({ dataset, activeField, onSelectField }: Props) {
  return (
    <div className={styles.datasetView}>
      <div className={styles.header}>
        <h1 className={styles.title}>{dataset.name}</h1>
        <div className={styles.metadata}>
          <span className={styles.metaItem}>
            <strong>Table:</strong> <code>{dataset.table}</code>
          </span>
          {dataset.class && (
            <span className={styles.metaItem}>
              <strong>Python Class:</strong> <code>{dataset.class}</code>
            </span>
          )}
          <span className={styles.metaItem}>
            <strong>Fields:</strong> {dataset.field_count}
          </span>
        </div>
      </div>

      {dataset.description && (
        <div className={styles.description}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p>{dataset.description}</p>
        </div>
      )}

      <div className={styles.fieldsSection}>
        <h2 className={styles.sectionTitle}>Fields</h2>
        <div className={styles.fieldGrid}>
          {dataset.fields.map(field => (
            <div
              key={field.name}
              className={`${styles.fieldCard} ${activeField === field.name ? styles.active : ''}`}
              onClick={() => onSelectField(field.name)}
            >
              <div className={styles.fieldHeader}>
                <span className={styles.fieldName}>{field.name}</span>
                {field.is_primary_key && (
                  <span className={styles.pkBadge}>PK</span>
                )}
              </div>
              <div className={styles.fieldInfo}>
                <span className={styles.fieldType}>{field.sql_type}</span>
                {field.required && (
                  <span className={styles.requiredBadge}>Required</span>
                )}
              </div>
              {field.description && (
                <div className={styles.fieldDescription}>
                  {field.description.length > 80 
                    ? `${field.description.substring(0, 80)}...` 
                    : field.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
