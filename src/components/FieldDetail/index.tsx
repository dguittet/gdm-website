import React from 'react';
import styles from './styles.module.css';

interface Field {
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

interface Props {
  field: Field;
  onClose?: () => void;
}

export default function FieldDetail({ field, onClose }: Props) {
  // Clean up Python type annotations for display
  const cleanPythonType = (type?: string) => {
    if (!type) return null;
    // Remove Annotated wrapper and other verbose parts
    return type
      .replace(/Annotated\[([^,]+),.*\]/g, '$1')
      .replace(/Optional\[([^\]]+)\]/g, '$1 (optional)')
      .trim();
  };

  const pythonType = cleanPythonType(field.python_type);

  return (
    <div className={styles.fieldDetail}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.fieldName}>{field.name}</h3>
          {field.is_primary_key && (
            <span className={styles.badge}>Primary Key</span>
          )}
          {field.required && (
            <span className={styles.badge}>Required</span>
          )}
        </div>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>
      
      <table className={styles.propertyTable}>
        <tbody>
          <tr>
            <td className={styles.propertyLabel}>Field Name</td>
            <td className={styles.propertyValue}><code>{field.name}</code></td>
          </tr>
          
          <tr>
            <td className={styles.propertyLabel}>SQL Type</td>
            <td className={styles.propertyValue}><code>{field.sql_type}</code></td>
          </tr>
          
          {pythonType && (
            <tr>
              <td className={styles.propertyLabel}>Python Type</td>
              <td className={styles.propertyValue}><code>{pythonType}</code></td>
            </tr>
          )}
          
          <tr>
            <td className={styles.propertyLabel}>Nullable</td>
            <td className={styles.propertyValue}>
              <span className={field.nullable ? styles.valueTrue : styles.valueFalse}>
                {field.nullable ? 'TRUE' : 'FALSE'}
              </span>
            </td>
          </tr>
          
          <tr>
            <td className={styles.propertyLabel}>Required</td>
            <td className={styles.propertyValue}>
              <span className={field.required ? styles.valueTrue : styles.valueFalse}>
                {field.required ? 'TRUE' : 'FALSE'}
              </span>
            </td>
          </tr>
          
          {field.default_value && (
            <tr>
              <td className={styles.propertyLabel}>Default Value</td>
              <td className={styles.propertyValue}><code>{field.default_value}</code></td>
            </tr>
          )}
          
          {field.constraints.length > 0 && (
            <tr>
              <td className={styles.propertyLabel}>Constraints</td>
              <td className={styles.propertyValue}>
                <ul className={styles.constraintList}>
                  {field.constraints.map((constraint, i) => (
                    <li key={i}><code>{constraint}</code></li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          
          {field.description && (
            <tr>
              <td className={styles.propertyLabel}>Description</td>
              <td className={styles.propertyValue}>{field.description}</td>
            </tr>
          )}
          
          {!field.description && (
            <tr>
              <td className={styles.propertyLabel}>Description</td>
              <td className={styles.propertyValue}>
                <span className={styles.noDescription}>No description available</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
