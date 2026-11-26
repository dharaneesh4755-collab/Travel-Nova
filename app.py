
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# ---------------------------------
# 1. HOME API
# ---------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "project": "TravelNova",
        "message": "Welcome to TravelNova Backend!",
        "status": "Running"
    })


# ---------------------------------
# 2. TRIP PLANNING API
# ---------------------------------
@app.route("/plan-trip", methods=["POST"])
def plan_trip():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data"}), 400

    try:
        days = int(data.get("days", 3))
        budget = float(data.get("budget", 10000))
    except (ValueError, TypeError):
        return jsonify({"error": "Enter valid days and budget"}), 400

    if days < 1 or days > 30:
        return jsonify({"error": "Trip days must be between 1 and 30"}), 400

    if budget <= 0:
        return jsonify({"error": "Budget must be greater than zero"}), 400

    destination = str(data.get("destination", "Unknown")).strip()
    style = str(data.get("style", "Adventure")).strip()

    if not destination:
        return jsonify({"error": "Please enter a destination"}), 400

    activities = {
        "Adventure": [
            "Explore adventure destinations",
            "Try outdoor activities",
            "Discover scenic locations"
        ],
        "Relaxation": [
            "Enjoy a peaceful morning",
            "Visit beautiful beaches",
            "Relax and enjoy local food"
        ],
        "Culture": [
            "Visit historical landmarks",
            "Explore local traditions",
            "Discover museums and markets"
        ],
        "Luxury": [
            "Enjoy premium sightseeing",
            "Explore elegant restaurants",
            "Experience a relaxing getaway"
        ],
        "Nature": [
            "Explore beautiful landscapes",
            "Visit scenic viewpoints",
            "Enjoy nature photography"
        ]
    }

    selected = activities.get(style, activities["Adventure"])

    itinerary = []

    for day in range(1, days + 1):
        itinerary.append({
            "day": day,
            "morning": selected[(day - 1) % len(selected)],
            "afternoon": "Explore local attractions",
            "evening": "Enjoy local food and relax"
        })

    return jsonify({
        "destination": destination,
        "days": days,
        "budget": budget,
        "style": style,
        "itinerary": itinerary,
        "message": "Your sample trip plan is ready!"
    })


# ---------------------------------
# 3. DESTINATION RECOMMENDATION API
# ---------------------------------
@app.route("/recommend-destinations", methods=["POST"])
def recommend_destinations():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data"}), 400

    style = str(data.get("style", "Adventure")).strip()

    destinations = {
        "Adventure": ["Manali", "Rishikesh", "Goa"],
        "Relaxation": ["Maldives", "Bali", "Munnar"],
        "Culture": ["Jaipur", "Agra", "Varanasi"],
        "Luxury": ["Dubai", "Singapore", "Paris"],
        "Nature": ["Ooty", "Coorg", "Wayanad"]
    }

    recommendations = destinations.get(
        style, destinations["Adventure"]
    )

    return jsonify({
        "style": style,
        "destinations": recommendations,
        "message": "Destination recommendations generated!"
    })


# ---------------------------------
# 4. BUDGET CALCULATOR API
# ---------------------------------
@app.route("/calculate-budget", methods=["POST"])
def calculate_budget():

    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data"}), 400

    try:
        budget = float(data.get("budget", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Enter a valid budget"}), 400

    if budget <= 0:
        return jsonify({"error": "Budget must be greater than zero"}), 400

    accommodation = budget * 0.35
    food = budget * 0.25
    transport = budget * 0.20
    activities = budget * 0.15
    emergency = budget * 0.05

    return jsonify({
        "total_budget": budget,
        "accommodation": accommodation,
        "food": food,
        "transport": transport,
        "activities": activities,
        "emergency_fund": emergency,
        "message": "Budget calculated successfully!"
    })


# ---------------------------------
# START TRAVELNOVA BACKEND
# ---------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
