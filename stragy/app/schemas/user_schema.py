def validate_user_payload(data):
    if not data.get("username"):
        raise ValueError("username is required")
    if not data.get("password_hash") and not data.get("password"):
        raise ValueError("password or password_hash is required")
    return data
