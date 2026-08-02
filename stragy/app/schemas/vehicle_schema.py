def validate_vehicle_payload(data):
    if not data.get("user_id"):
        raise ValueError("user_id is required")
    if not data.get("make"):
        raise ValueError("make is required")
    if not data.get("model"):
        raise ValueError("model is required")
    if not data.get("year"):
        raise ValueError("year is required")
    return data
