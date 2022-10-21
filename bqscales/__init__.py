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

from .scales import (  # noqa
    Scale, LinearScale, LogScale, DateScale, OrdinalScale,
    ColorScale, DateColorScale, OrdinalColorScale, GeoScale,
    Mercator, Albers, AlbersUSA, Gnomonic, Stereographic,
    Orthographic, EquiRectangular
)
from ._version import __version__  # noqa

from .nbextension import _jupyter_nbextension_paths  # noqa


def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': 'bqscales',
    }]
