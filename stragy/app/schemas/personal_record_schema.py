def validate_personal_record_payload(data):
    if not data.get("user_id"):
        raise ValueError("user_id is required")
    if not data.get("record_type"):
        raise ValueError("record_type is required")
    if data.get("value") is None:
        raise ValueError("value is required")
    return data
