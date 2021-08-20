#!/usr/bin/env python
# coding: utf-8

# Copyright 2015 Bloomberg Finance L.P.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import print_function
from glob import glob
from os import path

from setuptools import find_packages
from jupyter_packaging import (
    create_cmdclass, install_npm, ensure_targets,
    combine_commands, ensure_python,
    get_version, skip_if_exists
)

from setuptools import setup


HERE = path.dirname(path.abspath(__file__))

# The name of the project
name = 'bqscales'

# Ensure a valid python version
ensure_python('>=3.6')

# Get our version
version = get_version(path.join(name, '_version.py'))

nb_path = path.join(HERE, name, 'nbextension', 'static')
lab_path = path.join(HERE, name, 'labextension')

# Representative files that should exist after a successful build
jstargets = [
    path.join(nb_path, 'index.js'),
    path.join(lab_path, 'package.json'),
]

package_data_spec = {
    name: [
        'nbextension/static/*.*js*',
        'labextension/**'
    ]
}

data_files_spec = [
    ('share/jupyter/nbextensions/bqscales', nb_path, '*.js*'),
    ('share/jupyter/labextensions/bqscales', lab_path, '**'),
    ('etc/jupyter/nbconfig/notebook.d' , HERE, 'bqscales.json')
]


cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data_spec,
    data_files_spec=data_files_spec)
js_command = combine_commands(
    install_npm(HERE, npm=["yarn"], build_cmd='build'),
    ensure_targets(jstargets),
)

is_repo = path.exists(path.join(HERE, '.git'))
if is_repo:
    cmdclass['jsdeps'] = js_command
else:
    cmdclass['jsdeps'] = skip_if_exists(jstargets, js_command)


setup_args = dict(
    name=name,
    description='Grammar of Graphics in Python',
    version=version,
    scripts=glob(path.join('scripts', '*')),
    cmdclass=cmdclass,
    packages=find_packages(),
    author='Bqplot development team',
    url='https://github.com/bqplot/bqscales',
    license='Apache',
    platforms="Linux, Mac OS X, Windows",
    keywords=['Jupyter', 'Widgets', 'IPython'],
    classifiers=[
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Framework :: Jupyter',
    ],
    include_package_data=True,
    install_requires=[
        'ipywidgets>=7.5.0',
        'numpy',
    ],
    extras_require={
        'test': [
            'pytest>=3.6',
            'pytest-cov',
            'nbval',
        ],
        'examples': [
            # Any requirements for the examples to run
        ],
        'docs': [
            'sphinx>=1.5',
            'recommonmark',
            'sphinx_rtd_theme',
            'nbsphinx>=0.2.13,<0.4.0',
            'jupyter_sphinx',
            'nbsphinx-link',
            'pytest_check_links',
            'pypandoc',
        ],
    },
    entry_points={
    },
)

if __name__ == '__main__':
    setup(**setup_args)
