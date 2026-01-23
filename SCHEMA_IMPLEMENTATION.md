# Schema Documentation Implementation Guide

This guide outlines the steps to build the interactive ArcGIS-style schema documentation page.

## Overview

The schema documentation will be a single-page application (SPA) within the Docusaurus site that provides:
- Hierarchical navigation of datasets (tables)
- Detailed field information with types, constraints, and descriptions
- Search and filter capabilities
- Deep-linkable URLs (e.g., `#table~distribution_transformer~field~rated_voltage`)

## Architecture

```
Schema Parser (Python)
    ↓
JSON Data File
    ↓
React Components (TypeScript)
    ↓
Interactive Web Interface
```

## Phase 1: Data Extraction (Python)

### Step 1.1: Parse SQL Schema

Create `tools/extract_schema.py`:

```python
import re
import json
from pathlib import Path
from typing import Dict, List, Any

def parse_schema_sql(sql_file: Path) -> Dict[str, Any]:
    """Extract table definitions from schema.sql"""
    
    tables = {}
    
    with open(sql_file, 'r') as f:
        content = f.read()
    
    # Match CREATE TABLE statements
    table_pattern = r'CREATE TABLE (\w+) \((.*?)\);'
    matches = re.finditer(table_pattern, content, re.DOTALL)
    
    for match in matches:
        table_name = match.group(1)
        columns_text = match.group(2)
        
        columns = []
        for line in columns_text.split('\n'):
            line = line.strip()
            if not line or line.startswith('--'):
                continue
                
            # Parse column definition
            # Format: column_name TYPE [CONSTRAINTS]
            parts = line.split()
            if len(parts) >= 2:
                col_name = parts[0]
                col_type = parts[1]
                
                # Extract constraints
                nullable = 'NOT NULL' not in line
                has_default = 'DEFAULT' in line
                
                columns.append({
                    'name': col_name,
                    'sql_type': col_type,
                    'nullable': nullable,
                    'has_default': has_default,
                })
        
        tables[table_name] = {
            'name': table_name,
            'columns': columns
        }
    
    return tables

# Usage
schema_path = Path('../grid-data-models/src/gdm/sql/schema.sql')
tables = parse_schema_sql(schema_path)
```

### Step 1.2: Parse Python Classes

Create `tools/extract_docstrings.py`:

```python
import ast
import inspect
from pathlib import Path
from typing import Dict, Any, List
import importlib.util

def extract_field_info(class_node: ast.ClassDef) -> List[Dict[str, Any]]:
    """Extract field information from Pydantic class"""
    
    fields = []
    
    for item in class_node.body:
        if isinstance(item, ast.AnnAssign):
            # This is a field assignment
            field_name = item.target.id if isinstance(item.target, ast.Name) else None
            
            if field_name:
                field_info = {
                    'name': field_name,
                    'description': None,
                    'type': None,
                    'required': False,
                    'constraints': []
                }
                
                # Extract from Annotated[Type, Field(...)]
                if isinstance(item.annotation, ast.Subscript):
                    # Parse Field(description=..., ...) call
                    if isinstance(item.value, ast.Call):
                        for keyword in item.value.keywords:
                            if keyword.arg == 'description':
                                if isinstance(keyword.value, ast.Constant):
                                    field_info['description'] = keyword.value.value
                            elif keyword.arg == 'gt':
                                field_info['constraints'].append(f'> {keyword.value}')
                            elif keyword.arg == 'ge':
                                field_info['constraints'].append(f'>= {keyword.value}')
                
                fields.append(field_info)
    
    return fields

def parse_python_module(module_path: Path) -> Dict[str, Any]:
    """Parse a Python module and extract class information"""
    
    with open(module_path, 'r') as f:
        tree = ast.parse(f.read())
    
    classes = {}
    
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            class_info = {
                'name': node.name,
                'docstring': ast.get_docstring(node),
                'fields': extract_field_info(node)
            }
            classes[node.name] = class_info
    
    return classes

# Usage
component_path = Path('../grid-data-models/src/gdm/distribution/components/')
equipment_path = Path('../grid-data-models/src/gdm/distribution/equipment/')

all_classes = {}
for py_file in component_path.glob('*.py'):
    all_classes.update(parse_python_module(py_file))
```

### Step 1.3: Merge and Generate JSON

Create `tools/generate_schema_json.py`:

```python
import json
from pathlib import Path
from extract_schema import parse_schema_sql
from extract_docstrings import parse_python_module

# Mapping of SQL tables to Python classes
TABLE_CLASS_MAPPING = {
    'distribution_bus': 'DistributionBus',
    'distribution_transformer': 'DistributionTransformer',
    'matrix_impedance_branch': 'MatrixImpedanceBranch',
    'distribution_load': 'DistributionLoad',
    # ... add all mappings
}

def merge_schema_data(sql_tables: Dict, python_classes: Dict) -> Dict:
    """Merge SQL and Python metadata"""
    
    datasets = []
    
    for table_name, class_name in TABLE_CLASS_MAPPING.items():
        if table_name not in sql_tables:
            continue
            
        sql_table = sql_tables[table_name]
        python_class = python_classes.get(class_name, {})
        
        # Match SQL columns to Python fields
        fields = []
        for col in sql_table['columns']:
            col_name = col['name']
            
            # Find matching Python field
            python_field = next(
                (f for f in python_class.get('fields', []) if f['name'] == col_name),
                None
            )
            
            field_data = {
                'name': col_name,
                'sql_type': col['sql_type'],
                'nullable': col['nullable'],
                'description': python_field['description'] if python_field else None,
                'python_type': python_field['type'] if python_field else None,
                'constraints': python_field['constraints'] if python_field else [],
            }
            
            fields.append(field_data)
        
        datasets.append({
            'id': table_name,
            'name': table_name.replace('_', ' ').title(),
            'table': table_name,
            'class': class_name,
            'description': python_class.get('docstring', ''),
            'fields': fields
        })
    
    return {'datasets': datasets}

# Generate final JSON
schema_json = merge_schema_data(sql_tables, python_classes)

output_path = Path('../gdm-website/static/data/schema.json')
output_path.parent.mkdir(parents=True, exist_ok=True)

with open(output_path, 'w') as f:
    json.dump(schema_json, f, indent=2)

print(f"Schema JSON generated: {output_path}")
```

## Phase 2: React Components

### Step 2.1: Schema Data Hook

Create `src/hooks/useSchemaData.ts`:

```typescript
import { useState, useEffect } from 'react';

interface Field {
  name: string;
  sql_type: string;
  nullable: boolean;
  description?: string;
  python_type?: string;
  constraints: string[];
}

interface Dataset {
  id: string;
  name: string;
  table: string;
  class: string;
  description: string;
  fields: Field[];
}

interface SchemaData {
  datasets: Dataset[];
}

export function useSchemaData() {
  const [data, setData] = useState<SchemaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/data/schema.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
```

### Step 2.2: Schema Navigator Component

Create `src/components/SchemaNavigator/index.tsx`:

```typescript
import React from 'react';
import styles from './styles.module.css';

interface Dataset {
  id: string;
  name: string;
  table: string;
}

interface Props {
  datasets: Dataset[];
  activeDataset?: string;
  onSelectDataset: (id: string) => void;
}

export default function SchemaNavigator({ datasets, activeDataset, onSelectDataset }: Props) {
  return (
    <nav className={styles.navigator}>
      <h3 className={styles.title}>Datasets</h3>
      <ul className={styles.datasetList}>
        {datasets.map(dataset => (
          <li
            key={dataset.id}
            className={activeDataset === dataset.id ? styles.active : ''}
            onClick={() => onSelectDataset(dataset.id)}
          >
            {dataset.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Step 2.3: Field Detail Component

Create `src/components/FieldDetail/index.tsx`:

```typescript
import React from 'react';
import styles from './styles.module.css';

interface Field {
  name: string;
  sql_type: string;
  nullable: boolean;
  description?: string;
  python_type?: string;
  constraints: string[];
}

interface Props {
  field: Field;
}

export default function FieldDetail({ field }: Props) {
  return (
    <div className={styles.fieldDetail}>
      <h3 className={styles.fieldName}>{field.name}</h3>
      <table className={styles.propertyTable}>
        <tbody>
          <tr>
            <td><strong>Name</strong></td>
            <td>{field.name}</td>
          </tr>
          <tr>
            <td><strong>SQL Type</strong></td>
            <td>{field.sql_type}</td>
          </tr>
          {field.python_type && (
            <tr>
              <td><strong>Python Type</strong></td>
              <td>{field.python_type}</td>
            </tr>
          )}
          <tr>
            <td><strong>Nullable</strong></td>
            <td>{field.nullable ? 'TRUE' : 'FALSE'}</td>
          </tr>
          {field.constraints.length > 0 && (
            <tr>
              <td><strong>Constraints</strong></td>
              <td>{field.constraints.join(', ')}</td>
            </tr>
          )}
          {field.description && (
            <tr>
              <td><strong>Description</strong></td>
              <td>{field.description}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

### Step 2.4: Main Schema Page

Update `src/pages/schema.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useSchemaData } from '@site/src/hooks/useSchemaData';
import SchemaNavigator from '@site/src/components/SchemaNavigator';
import FieldDetail from '@site/src/components/FieldDetail';
import styles from './schema.module.css';

export default function Schema(): JSX.Element {
  const { data, loading, error } = useSchemaData();
  const [activeDataset, setActiveDataset] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Parse URL hash for deep linking
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Format: #table~distribution_transformer~field~rated_voltage
      const parts = hash.slice(1).split('~');
      if (parts[0] === 'table' && parts[1]) {
        setActiveDataset(parts[1]);
      }
      if (parts[2] === 'field' && parts[3]) {
        setActiveField(parts[3]);
      }
    }
  }, []);

  if (loading) return <div>Loading schema...</div>;
  if (error) return <div>Error loading schema: {error.message}</div>;
  if (!data) return <div>No schema data available</div>;

  const currentDataset = data.datasets.find(d => d.id === activeDataset);
  const currentField = currentDataset?.fields.find(f => f.name === activeField);

  return (
    <Layout title="Schema Documentation">
      <div className={styles.schemaLayout}>
        <SchemaNavigator
          datasets={data.datasets}
          activeDataset={activeDataset}
          onSelectDataset={setActiveDataset}
        />
        <main className={styles.content}>
          {currentDataset && (
            <div>
              <h1>{currentDataset.name}</h1>
              <p>{currentDataset.description}</p>
              
              <h2>Fields</h2>
              <ul>
                {currentDataset.fields.map(field => (
                  <li
                    key={field.name}
                    onClick={() => setActiveField(field.name)}
                  >
                    {field.name}
                  </li>
                ))}
              </ul>
              
              {currentField && <FieldDetail field={currentField} />}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
```

## Phase 3: Deep Linking

Add hash routing support:

```typescript
// Update URL when selection changes
const handleSelectDataset = (datasetId: string) => {
  setActiveDataset(datasetId);
  window.location.hash = `table~${datasetId}`;
};

const handleSelectField = (fieldName: string) => {
  setActiveField(fieldName);
  window.location.hash = `table~${activeDataset}~field~${fieldName}`;
};
```

## Phase 4: Search

Install Fuse.js:
```bash
npm install fuse.js
```

Add search component:
```typescript
import Fuse from 'fuse.js';

const fuse = new Fuse(allFields, {
  keys: ['name', 'description'],
  threshold: 0.3,
});

const results = fuse.search(searchQuery);
```

## Testing

1. Generate schema JSON
2. Verify data structure
3. Test navigation
4. Test deep linking
5. Test search functionality

## Deployment

The schema.json file should be regenerated whenever:
- `schema.sql` changes
- Python class definitions change
- New tables/fields are added

Consider adding a pre-build script in `package.json`:
```json
{
  "scripts": {
    "generate-schema": "python tools/generate_schema_json.py",
    "prebuild": "npm run generate-schema"
  }
}
```
