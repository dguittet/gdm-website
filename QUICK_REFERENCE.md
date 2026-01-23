# Schema Documentation Quick Reference

## 🚀 Quick Commands

```bash
# Start development server
npm start

# Regenerate schema data
npm run generate-schema

# Build for production (auto-regenerates schema)
npm run build
```

## 🔗 URLs

- **Homepage**: http://localhost:3000/
- **Schema Docs**: http://localhost:3000/schema
- **Contact**: http://localhost:3000/contact

## 📊 Schema Stats

- **Datasets**: 55 tables
- **Fields**: 395 columns
- **Python Classes**: 42 models
- **Data Size**: 133KB JSON

## 🎯 Deep Linking Examples

```
# Link to dataset
/schema#table~distribution_bus

# Link to specific field
/schema#table~distribution_bus~field~rated_voltage

# Link to equipment
/schema#table~matrix_impedance_branch_equipment~field~ampacity
```

## 🔍 Navigation

### Sidebar
- **Collapse/Expand**: Click arrow button (←/→)
- **Categories**: Components, Equipment, Controllers, Supporting
- **Click Dataset**: Opens in main view

### Search
- Type in search bar
- Filters datasets by name or table
- Live updates

### Field Detail
- Click any field card
- Shows complete property table
- Click × to close
- Auto-scrolls into view

## 📁 Key Files

```
tools/extract_schema.py              # Schema extraction
src/hooks/useSchemaData.ts           # Data loading
src/components/SchemaNavigator/      # Sidebar
src/components/DatasetView/          # Dataset display
src/components/FieldDetail/          # Field properties
src/pages/schema.tsx                 # Main page
static/data/schema.json              # Generated data
```

## 🎨 Color Codes

- **Blue** (#3b82f6) - Primary/Active
- **Cyan** (#06b6d4) - Accents/Code
- **Purple** (#a855f7) - Primary Keys
- **Red** (#ef4444) - Required
- **Green** (#10b981) - Valid/True
- **Gray** (#64748b) - Secondary

## 🐛 Troubleshooting

### Schema not loading?
```bash
python3 tools/extract_schema.py
```

### Path errors?
Check that `grid-data-models/` exists at:
```
Projects/GDM/grid-data-models/
```

### Missing descriptions?
Some fields lack docstrings - this is expected.
Add descriptions to Python classes to improve docs.

## 📱 Mobile

- Sidebar becomes top section
- Collapses by default
- Field grid stacks vertically
- Property tables reformatted

## ⌨️ Tips

1. **Search first** - Faster than scrolling
2. **Use deep links** - Share specific fields
3. **Check related fields** - Look for `_uuid`, `_value_si` patterns
4. **Read descriptions** - Python docstrings have details
5. **Note constraints** - Important for validation

## 📚 Documentation Files

- [README.md](README.md) - Project overview
- [SCHEMA_IMPLEMENTATION.md](SCHEMA_IMPLEMENTATION.md) - Technical guide
- [SCHEMA_USAGE.md](SCHEMA_USAGE.md) - User manual
- [SCHEMA_SUMMARY.md](SCHEMA_SUMMARY.md) - Implementation summary
- This file - Quick reference

---

**Website**: http://localhost:3000  
**Schema**: http://localhost:3000/schema  
**Last Updated**: January 23, 2026
