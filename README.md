# Grid-Data-Models Website

A modern, multi-page website for Grid-Data-Models built with Docusaurus, featuring a dark color scheme and developer-focused aesthetic.

## 🎯 Overview

This website showcases the Grid-Data-Models platform with:
- **Homepage**: Comprehensive overview with value propositions, comparisons, and roadmap
- **Schema Documentation**: ✅ **LIVE** Interactive ArcGIS-style schema browser with 55 datasets and 395 fields
- **Contact Page**: Information about partnerships and contact details
- **Embedded Map Section**: Ready to integrate GIS data visualizations

## 🎨 Design System

### Color Scheme
- **Background**: Deep blues and blacks (#0a0e1a, #0f172a, #1e293b)
- **Primary Accent**: Bright blue (#3b82f6)
- **Secondary Accent**: Cyan (#06b6d4)
- **Text**: Slate grays (#94a3b8, #64748b)

### Typography
- **Font Family**: Inter, system fonts
- **Heading Weight**: 700
- **Body Weight**: 500

## 🚀 Quick Start

```bash
cd gdm-website
npm start        # Start dev server at http://localhost:3000
npm run build    # Build for production (auto-generates schema)
npm run serve    # Preview production build
```

## 📊 Schema Documentation

The interactive schema documentation is **fully implemented** and displays:
- 55 datasets from the SQL schema
- 395 fields with complete metadata
- Descriptions extracted from Python docstrings
- Deep-linkable URLs for sharing
- Search and filter capabilities

**Regenerate schema data** (when SQL or Python changes):
```bash
npm run generate-schema
```

See [SCHEMA_USAGE.md](SCHEMA_USAGE.md) for detailed usage guide.

## 📁 Project Structure

```
gdm-website/
├── docusaurus.config.ts    # Main configuration
├── src/
│   ├── css/
│   │   └── custom.css      # Global styles
│   ├── pages/
│   │   ├── index.tsx       # Homepage
│   │   ├── schema.tsx      # Schema docs ✅ IMPLEMENTED
│   │   └── contact.tsx     # Contact page
│   ├── components/
│   │   ├── SchemaNavigator/     # Sidebar navigation
│   │   ├── DatasetView/         # Dataset display
│   │   └── FieldDetail/         # Field property table
│   └── hooks/
│       └── useSchemaData.ts     # Data fetching hook
├── static/
│   └── data/
│       └── schema.json          # Generated schema data
└── tools/
    └── extract_schema.py        # Schema extraction script
```

## 🔧 Customization

### Add Your Map URL

In `src/pages/index.tsx` (line ~217):
```tsx
<iframe src="YOUR_MAP_URL_HERE" ... />
```

### Modify Theme Colors

In `src/css/custom.css`:
```css
[data-theme='dark'] {
  --ifm-color-primary: #3b82f6;
  --ifm-color-accent: #06b6d4;
}
```

## 📋 Next Steps for Schema Documentation

~~1. **Create Python parser** to extract schema from `schema.sql` and Python classes~~ ✅ **DONE**
~~2. **Generate JSON data file** with table/field metadata~~ ✅ **DONE**
~~3. **Build React components** for interactive navigation~~ ✅ **DONE**
~~4. **Implement deep-linking** with URL hash routing~~ ✅ **DONE**
~~5. **Add search functionality**~~ ✅ **DONE**

See the `/schema` page for detailed implementation plan.

## 🛠️ Technologies

- Docusaurus 3.9.2
- TypeScript
- CSS Modules
- React

---

*Built with Docusaurus*
