"""
Utility helpers for sanitizing text content before persisting to the database.
"""

def sanitize_text_for_storage(content: str) -> str:
    """
    Prepare text content for storage in PostgreSQL text columns.

    - Strips NULL bytes which PostgreSQL rejects in text/varchar fields.

    Args:
        content: Raw string content.

    Returns:
        Sanitized string safe for insertion.
    """
    if content is None:
        return content
    # PostgreSQL text columns cannot store NULL bytes; strip them defensively.
    return content.replace("\x00", "")

