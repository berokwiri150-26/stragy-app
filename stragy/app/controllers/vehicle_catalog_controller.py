import json
import os
import urllib.parse
import urllib.request

from sqlalchemy import or_

from app.models.vehicle import Vehicle


def _fetch_external_catalog(query):
    base_url = os.environ.get("VEHICLE_CATALOG_API_URL")
    if not base_url:
        return []

    params = {"query": query}
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    headers = {"Accept": "application/json"}
    api_key = os.environ.get("VEHICLE_CATALOG_API_KEY")
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request) as response:
        data = json.loads(response.read().decode("utf-8"))

    if isinstance(data, dict) and "results" in data:
        return data["results"]
    if isinstance(data, list):
        return data
    return []


def search_vehicle_catalog(query):
    query = (query or "").strip()
    if query and os.environ.get("VEHICLE_CATALOG_API_URL"):
        return _fetch_external_catalog(query)

    like_query = f"%{query}%"
    query_filters = [
        Vehicle.make.ilike(like_query),
        Vehicle.model.ilike(like_query),
    ]
    if query.isdigit():
        query_filters.append(Vehicle.year == int(query))

    return Vehicle.query.filter(or_(*query_filters)).all()
