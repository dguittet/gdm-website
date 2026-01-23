import React, { useState } from 'react';
import styles from './styles.module.css';

interface Dataset {
  id: string;
  name: string;
  table: string;
  field_count: number;
}

interface Props {
  datasets: Dataset[];
  activeDataset?: string;
  onSelectDataset: (id: string) => void;
  searchQuery?: string;
}

export default function SchemaNavigator({ 
  datasets, 
  activeDataset, 
  onSelectDataset,
  searchQuery = ''
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  
  // Filter datasets by search query
  const filteredDatasets = datasets.filter(dataset => 
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.table.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group datasets by category (simple grouping by prefix)
  const groupedDatasets: { [key: string]: Dataset[] } = {
    'Components': [],
    'Equipment': [],
    'Controllers': [],
    'Supporting': [],
  };
  
  filteredDatasets.forEach(dataset => {
    if (dataset.table.includes('equipment')) {
      groupedDatasets['Equipment'].push(dataset);
    } else if (dataset.table.includes('controller')) {
      groupedDatasets['Controllers'].push(dataset);
    } else if (dataset.table.startsWith('distribution_')) {
      groupedDatasets['Components'].push(dataset);
    } else {
      groupedDatasets['Supporting'].push(dataset);
    }
  });

  return (
    <nav className={`${styles.navigator} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Datasets</h3>
        <button 
          className={styles.collapseButton}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      {!collapsed && (
        <div className={styles.content}>
          <div className={styles.stats}>
            {filteredDatasets.length} of {datasets.length} datasets
          </div>
          
          {Object.entries(groupedDatasets).map(([category, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={category} className={styles.group}>
                <div className={styles.groupTitle}>{category}</div>
                <ul className={styles.datasetList}>
                  {items.map(dataset => (
                    <li
                      key={dataset.id}
                      className={`${styles.datasetItem} ${activeDataset === dataset.id ? styles.active : ''}`}
                      onClick={() => onSelectDataset(dataset.id)}
                    >
                      <div className={styles.datasetName}>{dataset.name}</div>
                      <div className={styles.datasetInfo}>
                        {dataset.field_count} fields
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          
          {filteredDatasets.length === 0 && (
            <div className={styles.noResults}>
              No datasets match your search
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
