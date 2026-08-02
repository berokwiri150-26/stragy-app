def validate_driving_stats_payload(data):
    if not data.get("user_id"):
        raise ValueError("user_id is required")
    return data
