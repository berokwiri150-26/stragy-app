"""Time helpers for StrAgy.

The history: models under ``app/models`` import ``utcnow`` from this module
(``app.utils.time``) and from the package root (``app.utils``). Both files were
empty, so those imports raised ``ImportError: cannot import name 'utcnow'``.
This module now defines it, and ``app/utils/__init__.py`` re-exports it.
"""

from datetime import datetime, timezone


def utcnow():
    """Return the current UTC time (timezone-aware)."""
    return datetime.now(timezone.utc)


__all__ = ["utcnow"]
