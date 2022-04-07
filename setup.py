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
from os import path

from jupyter_packaging import (
    create_cmdclass, install_npm, ensure_targets,
    combine_commands,
    get_version, skip_if_exists
)

from setuptools import setup


HERE = path.dirname(path.abspath(__file__))

# The name of the project
name = 'bqscales'

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
    ('etc/jupyter/nbconfig/notebook.d', HERE, 'bqscales.json')
]

cmdclass = create_cmdclass(
    'jsdeps',
    package_data_spec=package_data_spec,
    data_files_spec=data_files_spec
)
js_command = combine_commands(
    install_npm(HERE, npm=["yarn"], build_cmd='build'),
    ensure_targets(jstargets),
)

is_repo = path.exists(path.join(HERE, '.git'))
if is_repo:
    cmdclass['jsdeps'] = js_command
else:
    cmdclass['jsdeps'] = skip_if_exists(jstargets, js_command)


setup_args = dict(version=version, cmdclass=cmdclass)

if __name__ == '__main__':
    setup(**setup_args)
