#!/usr/bin/env python3
"""
Extract schema information from schema.sql and Python classes.
Generates a JSON file for the web-based schema documentation.
"""

import re
import json
import ast
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import defaultdict


def parse_schema_sql(sql_file: Path) -> Dict[str, Any]:
    """Extract table definitions from schema.sql"""
    
    tables = {}
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match CREATE TABLE statements
    table_pattern = r'CREATE TABLE\s+(\w+)\s*\((.*?)\);'
    matches = re.finditer(table_pattern, content, re.DOTALL | re.IGNORECASE)
    
    for match in matches:
        table_name = match.group(1)
        columns_text = match.group(2)
        
        columns = []
        lines = columns_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('--') or line.upper().startswith('CONSTRAINT') or line.upper().startswith('PRIMARY') or line.upper().startswith('FOREIGN'):
                continue
            
            # Remove trailing commas
            line = line.rstrip(',')
            
            # Parse column definition
            parts = line.split()
            if len(parts) >= 2 and not parts[0].upper() in ['CHECK', 'UNIQUE', 'INDEX']:
                col_name = parts[0]
                col_type = parts[1]
                
                # Extract constraints
                line_upper = line.upper()
                nullable = 'NOT NULL' not in line_upper
                has_default = 'DEFAULT' in line_upper
                is_primary = 'PRIMARY KEY' in line_upper
                
                # Extract default value if present
                default_value = None
                if has_default:
                    default_match = re.search(r'DEFAULT\s+([^\s,]+)', line, re.IGNORECASE)
                    if default_match:
                        default_value = default_match.group(1)
                
                columns.append({
                    'name': col_name,
                    'sql_type': col_type,
                    'nullable': nullable,
                    'has_default': has_default,
                    'default_value': default_value,
                    'is_primary_key': is_primary,
                })
        
        if columns:  # Only add tables with columns
            tables[table_name] = {
                'name': table_name,
                'columns': columns
            }
    
    return tables


def extract_field_info(class_source: str, class_name: str) -> List[Dict[str, Any]]:
    """Extract field information from Pydantic class source code"""
    
    try:
        tree = ast.parse(class_source)
    except SyntaxError:
        return []
    
    fields = []
    
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name == class_name:
            for item in node.body:
                if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                    field_name = item.target.id
                    
                    field_info = {
                        'name': field_name,
                        'description': None,
                        'python_type': None,
                        'required': False,
                        'constraints': [],
                        'default_value': None,
                    }
                    
                    # Try to extract type name
                    try:
                        field_info['python_type'] = ast.unparse(item.annotation)
                    except:
                        pass
                    
                    # Extract from Field(...) call if present
                    if isinstance(item.value, ast.Call):
                        # Check if it's a Field call
                        for keyword in item.value.keywords:
                            if keyword.arg == 'description':
                                if isinstance(keyword.value, ast.Constant):
                                    field_info['description'] = keyword.value.value
                            elif keyword.arg == 'default':
                                try:
                                    field_info['default_value'] = ast.unparse(keyword.value)
                                except:
                                    pass
                            elif keyword.arg == 'gt':
                                try:
                                    val = ast.literal_eval(keyword.value)
                                    field_info['constraints'].append(f'> {val}')
                                except:
                                    pass
                            elif keyword.arg == 'ge':
                                try:
                                    val = ast.literal_eval(keyword.value)
                                    field_info['constraints'].append(f'>= {val}')
                                except:
                                    pass
                            elif keyword.arg == 'lt':
                                try:
                                    val = ast.literal_eval(keyword.value)
                                    field_info['constraints'].append(f'< {val}')
                                except:
                                    pass
                            elif keyword.arg == 'le':
                                try:
                                    val = ast.literal_eval(keyword.value)
                                    field_info['constraints'].append(f'<= {val}')
                                except:
                                    pass
                        
                        # Check if Field has ... (required)
                        if any(isinstance(arg, ast.Constant) and arg.value is ... for arg in item.value.args):
                            field_info['required'] = True
                    
                    fields.append(field_info)
            break
    
    return fields


def parse_python_module(module_path: Path) -> Dict[str, Any]:
    """Parse a Python module and extract class information"""
    
    if not module_path.exists():
        return {}
    
    with open(module_path, 'r', encoding='utf-8') as f:
        source = f.read()
    
    classes = {}
    
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return {}
    
    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            docstring = ast.get_docstring(node)
            class_info = {
                'name': node.name,
                'docstring': docstring if docstring else '',
                'fields': extract_field_info(source, node.name),
                'file': str(module_path)
            }
            classes[node.name] = class_info
    
    return classes


def scan_python_classes(base_path: Path) -> Dict[str, Any]:
    """Scan all Python files in components and equipment directories"""
    
    all_classes = {}
    
    # Scan components
    components_path = base_path / 'components'
    if components_path.exists():
        for py_file in components_path.rglob('*.py'):
            if py_file.name != '__init__.py':
                classes = parse_python_module(py_file)
                all_classes.update(classes)
    
    # Scan equipment
    equipment_path = base_path / 'equipment'
    if equipment_path.exists():
        for py_file in equipment_path.rglob('*.py'):
            if py_file.name != '__init__.py':
                classes = parse_python_module(py_file)
                all_classes.update(classes)
    
    return all_classes


# Common table-to-class mappings
TABLE_CLASS_MAPPING = {
    'distribution_bus': 'DistributionBus',
    'matrix_impedance_branch': 'MatrixImpedanceBranch',
    'sequence_impedance_branch': 'SequenceImpedanceBranch',
    'geometry_branch': 'GeometryBranch',
    'distribution_switch': 'DistributionSwitch',
    'distribution_fuse': 'DistributionFuse',
    'distribution_recloser': 'DistributionRecloser',
    'distribution_transformer': 'DistributionTransformer',
    'distribution_regulator': 'DistributionRegulator',
    'distribution_load': 'DistributionLoad',
    'distribution_solar': 'DistributionSolar',
    'distribution_battery': 'DistributionBattery',
    'distribution_capacitor': 'DistributionCapacitor',
    'distribution_voltage_source': 'DistributionVoltageSource',
    'matrix_impedance_branch_equipment': 'MatrixImpedanceBranchEquipment',
    'matrix_impedance_fuse_equipment': 'MatrixImpedanceFuseEquipment',
    'matrix_impedance_switch_equipment': 'MatrixImpedanceSwitchEquipment',
    'matrix_impedance_recloser_equipment': 'MatrixImpedanceRecloserEquipment',
    'sequence_impedance_branch_equipment': 'SequenceImpedanceBranchEquipment',
    'geometry_branch_equipment': 'GeometryBranchEquipment',
    'bare_conductor_equipment': 'BareConductorEquipment',
    'concentric_cable_equipment': 'ConcentricCableEquipment',
    'distribution_transformer_equipment': 'DistributionTransformerEquipment',
    'winding_equipment': 'WindingEquipment',
    'phase_load_equipment': 'PhaseLoadEquipment',
    'solar_equipment': 'SolarEquipment',
    'battery_equipment': 'BatteryEquipment',
    'capacitor_equipment': 'CapacitorEquipment',
    'phase_capacitor_equipment': 'PhaseCapacitorEquipment',
    'voltage_source_equipment': 'VoltageSourceEquipment',
    'phase_voltage_source_equipment': 'PhaseVoltageSourceEquipment',
    'inverter_controller': 'InverterController',
    'voltage_capacitor_controller': 'VoltageCapacitorController',
    'regulator_controller': 'RegulatorController',
}


def merge_schema_data(sql_tables: Dict, python_classes: Dict) -> Dict:
    """Merge SQL and Python metadata into unified schema"""
    
    datasets = []
    
    for table_name, table_info in sql_tables.items():
        class_name = TABLE_CLASS_MAPPING.get(table_name)
        python_class = python_classes.get(class_name, {}) if class_name else {}
        
        # Create field lookup from Python
        python_fields = {f['name']: f for f in python_class.get('fields', [])}
        
        # Merge columns with Python field info
        fields = []
        for col in table_info['columns']:
            col_name = col['name']
            python_field = python_fields.get(col_name, {})
            
            field_data = {
                'name': col_name,
                'sql_type': col['sql_type'],
                'python_type': python_field.get('python_type'),
                'nullable': col['nullable'],
                'required': python_field.get('required', not col['nullable']),
                'description': python_field.get('description'),
                'constraints': python_field.get('constraints', []),
                'default_value': col.get('default_value') or python_field.get('default_value'),
                'is_primary_key': col.get('is_primary_key', False),
            }
            
            fields.append(field_data)
        
        dataset = {
            'id': table_name,
            'name': table_name.replace('_', ' ').title(),
            'table': table_name,
            'class': class_name,
            'description': python_class.get('docstring', ''),
            'fields': fields,
            'field_count': len(fields),
        }
        
        datasets.append(dataset)
    
    # Sort datasets by name
    datasets.sort(key=lambda x: x['name'])
    
    return {
        'datasets': datasets,
        'dataset_count': len(datasets),
        'generated_at': '2026-01-23',
    }


def main():
    """Main execution function"""
    
    # Paths - adjusted to find grid-data-models at the same level as gdm-website
    project_root = Path(__file__).parent.parent.parent
    schema_sql = project_root / 'grid-data-models' / 'src' / 'gdm' / 'sql' / 'schema.sql'
    python_base = project_root / 'grid-data-models' / 'src' / 'gdm' / 'distribution'
    output_json = Path(__file__).parent.parent / 'static' / 'data' / 'schema.json'
    
    print("🔍 Extracting schema from SQL...")
    print(f"   Looking for: {schema_sql}")
    
    if not schema_sql.exists():
        print(f"   ❌ Schema file not found!")
        print(f"   Please ensure grid-data-models is in the correct location")
        return
    
    sql_tables = parse_schema_sql(schema_sql)
    print(f"   Found {len(sql_tables)} tables")
    
    print("\n🐍 Parsing Python classes...")
    python_classes = scan_python_classes(python_base)
    print(f"   Found {len(python_classes)} classes")
    
    print("\n🔗 Merging schema data...")
    schema_data = merge_schema_data(sql_tables, python_classes)
    
    print("\n💾 Writing schema.json...")
    output_json.parent.mkdir(parents=True, exist_ok=True)
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(schema_data, f, indent=2)
    
    print(f"\n✅ Schema documentation generated!")
    print(f"   Output: {output_json}")
    print(f"   Datasets: {schema_data['dataset_count']}")
    print(f"   Total fields: {sum(d['field_count'] for d in schema_data['datasets'])}")


if __name__ == '__main__':
    main()
