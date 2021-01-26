"""Custom Traits."""
import datetime
import numpy as np

from traitlets import TraitType


def date_to_json(value, obj):
    """Serialize a Date value."""
    if value is None:
        return value
    else:
        return value.strftime('%Y-%m-%dT%H:%M:%S.%f')


def date_from_json(value, obj):
    """Deserialize a Date value."""
    if value:
        return datetime.datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%f')
    else:
        return value


date_serialization = dict(to_json=date_to_json, from_json=date_from_json)


class Date(TraitType):
    """
    A datetime trait type.

    Converts the passed date into a string format that can be used to
    construct a JavaScript datetime.
    """

    def validate(self, obj, value):
        """Validate the Date value."""
        try:
            if isinstance(value, datetime.datetime):
                return value
            if isinstance(value, datetime.date):
                return datetime.datetime(value.year, value.month, value.day)
            if np.issubdtype(np.dtype(value), np.datetime64):
                # TODO: Fix this. Right now, we have to limit the precision
                # of time to microseconds because np.datetime64.astype(datetime)
                # returns date values only for precision <= 'us'
                value_truncated = np.datetime64(value, 'us')
                return value_truncated.astype(datetime.datetime)
        except Exception:
            self.error(obj, value)
        self.error(obj, value)

    def __init__(self, default_value=datetime.datetime.today(), **kwargs):
        """Create a Date instance."""
        args = (default_value,)
        self.default_value = default_value
        super(Date, self).__init__(args=args, **kwargs)
        self.tag(**date_serialization)
