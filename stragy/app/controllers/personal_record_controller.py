from app.models.personal_record import PersonalRecord
from server.extensions import db


def create_personal_record(data):
    record = PersonalRecord(
        user_id=data.get("user_id"),
        vehicle_id=data.get("vehicle_id"),
        trip_id=data.get("trip_id"),
        record_type=data.get("record_type"),
        value=data.get("value"),
        unit=data.get("unit"),
        date_achieved=data.get("date_achieved"),
    )
    db.session.add(record)
    db.session.commit()
    return record


def list_personal_records():
    return PersonalRecord.query.all()
