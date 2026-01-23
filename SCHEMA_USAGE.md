# Schema Documentation User Guide

## Overview

The Schema Documentation page provides an interactive, ArcGIS-style interface for exploring the Grid-Data-Models database schema. It displays 55 datasets with 395 fields extracted from both SQL schema definitions and Python class docstrings.

## Features

### 1. Hierarchical Navigation
- **Sidebar Navigator**: Browse datasets organized by category
  - Components (distribution system elements)
  - Equipment (catalog items)
  - Controllers (control systems)
  - Supporting (auxiliary tables)
- **Collapsible Sidebar**: Click the arrow button to collapse/expand
- **Field Count**: Each dataset shows its field count

### 2. Search & Filter
- **Search Bar**: Type to filter datasets by name or table name
- **Live Filtering**: Results update as you type
- **Statistics**: Shows filtered/total dataset counts

### 3. Dataset View
- **Overview**: Dataset name, table, Python class, field count
- **Description**: Class-level docstring if available
- **Field Grid**: All fields displayed as interactive cards
  - Field name (monospace font)
  - SQL type
  - Required/Optional badge
  - Primary key indicator (PK)
  - Truncated description preview

### 4. Field Detail
- **Property Table**: Complete field information
  - Field name
  - SQL type (e.g., `UUID`, `VARCHAR`, `NUMERIC`)
  - Python type (e.g., `Voltage`, `Optional[float]`)
  - Nullable (TRUE/FALSE)
  - Required (TRUE/FALSE)
  - Default value
  - Constraints (e.g., `> 0`, `>= 0`)
  - Full description from docstrings
- **Visual Indicators**: Color-coded badges and values
- **Close Button**: Click × to dismiss detail view

### 5. Deep Linking
URLs are automatically updated to allow direct linking:

- **Dataset**: `http://localhost:3000/schema#table~distribution_bus`
- **Field**: `http://localhost:3000/schema#table~distribution_bus~field~rated_voltage`

Share these links to point colleagues directly to specific documentation.

## Usage Examples

### Browse by Category

1. Open `/schema` page
2. Look at the sidebar grouped by category
3. Click "Distribution Bus" under "Components"
4. View all bus-related fields

### Search for Specific Dataset

1. Type "transformer" in the search bar
2. See filtered results: `distribution_transformer`, `distribution_transformer_equipment`
3. Click on desired dataset

### Examine Field Properties

1. Navigate to a dataset (e.g., "Distribution Bus")
2. Click on a field card (e.g., "rated_voltage")
3. View complete property table with:
   - Types (SQL + Python)
   - Constraints
   - Description from docstring

### Share Documentation Link

1. Navigate to the field you want to share
2. Copy the URL from browser (includes hash)
3. Share with team member
4. They can click link and land directly on that field

## Data Source

The schema documentation is generated from:

1. **schema.sql**: Table and column definitions
   - Column names
   - SQL types
   - Nullable constraints
   - Default values
   - Primary keys

2. **Python Classes**: Field metadata from Pydantic models
   - Field descriptions from `Field(description=...)`
   - Python type annotations
   - Validators and constraints (`gt`, `ge`, `lt`, `le`)
   - Required/optional indicators

## Regenerating Documentation

When the schema changes, regenerate the JSON:

```bash
cd gdm-website
npm run generate-schema
```

Or manually:
```bash
python3 tools/extract_schema.py
```

The build process automatically regenerates on `npm run build`.

## Color Coding

- **Blue** (#3b82f6): Primary elements (titles, active items)
- **Cyan** (#06b6d4): Accents (badges, code)
- **Purple** (#a855f7): Primary keys
- **Red** (#ef4444): Required fields, FALSE values
- **Green** (#10b981): TRUE values
- **Gray** (#64748b, #94a3b8): Secondary text

## Keyboard Shortcuts

- **Arrow Keys**: Navigate in sidebar (when focused)
- **Enter**: Select dataset/field (when focused)
- **Esc**: Close field detail (planned)
- **Ctrl/Cmd + F**: Focus search bar (browser default)

## Tips

### Finding Related Fields
Many datasets have related fields with common prefixes:
- `*_uuid`: Foreign key references
- `*_value_original`, `*_units_original`, `*_value_si`: Quantity fields with unit conversion
- `*_json`: Complex data structures stored as JSONB

### Understanding Inheritance
Some tables inherit from base tables:
- All component tables reference `component_base`
- Equipment tables have common structure
- Look for `*_equipment_base` patterns

### Matrix Fields
Fields ending in `_matrix` store arrays/matrices:
- Usually have corresponding `*_units` field
- May have extracted diagonal elements (`r11`, `r22`, `r33`)
- Stored as JSONB in database

### Quantity Types
Python types like `Voltage`, `Current`, `ActivePower`:
- Represent physical quantities with units
- Split into multiple SQL columns (value + units + SI normalized)
- Use Pint library for unit conversion

## Troubleshooting

### "No Schema Data Available"
- Run `npm run generate-schema`
- Ensure `grid-data-models` folder exists at correct path
- Check that `static/data/schema.json` was created

### Missing Descriptions
Some fields may lack descriptions:
- Not all fields have docstrings in Python code
- Some are inherited from base classes
- Consider adding docstrings to improve documentation

### Search Not Finding Dataset
- Try table name instead of display name
  - Display: "Distribution Bus"
  - Table: "distribution_bus"
- Search is case-insensitive
- Matches both name and table fields

### Deep Link Not Working
- Ensure hash format is correct: `#table~{table_name}~field~{field_name}`
- No spaces or special characters
- Use underscores in table/field names

## Future Enhancements

Potential improvements:
- [ ] Relationship diagrams (ERD)
- [ ] Example queries for each table
- [ ] Export to PDF/Markdown
- [ ] Version comparison
- [ ] Field usage examples
- [ ] Interactive SQL query builder
- [ ] Type hierarchy visualization

## Feedback

If you find issues or have suggestions:
1. Check GitHub Issues
2. Submit new issue with:
   - What you were trying to do
   - What happened
   - What you expected
   - Screenshot if applicable
