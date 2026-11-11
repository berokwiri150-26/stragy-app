"""Error-handling helpers for StrAgy.

The history: ``services/clan_service.py`` and ``services/follow_service.py``
import ``APIError`` from this module, but the file was empty, so every import
failed with ``ImportError: cannot import name 'APIError'``. This module now
defines it.
"""


class APIError(Exception):
    """An application-level error that carries an HTTP status code."""

    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


__all__ = ["APIError"]
