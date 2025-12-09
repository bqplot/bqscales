import json, pathlib


pkg = pathlib.Path('bqscales')
pkg.mkdir(exist_ok=True)

with open('package.json') as f:
    version = json.load(f)['version']

with open(pkg / '_version.py', 'w') as f:
    f.write(f'# Auto-generated from package.json\\n__version__ = "{version}"\\n')
