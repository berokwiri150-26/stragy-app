def validate_trip_payload(data):
    if not data.get("vehicle_id"):
        raise ValueError("vehicle_id is required")
    if not data.get("start_location"):
        raise ValueError("start_location is required")
    if not data.get("end_location"):
        raise ValueError("end_location is required")
    return data
