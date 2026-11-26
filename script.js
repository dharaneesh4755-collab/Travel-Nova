
// ======================================
// TRAVELNOVA - INTERACTIVE WEBSITE
// ======================================

// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("open");

    menuToggle.textContent =
        navigation.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll("#navigation a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.textContent = "☰";
    });
});


// 2. DESTINATION SEARCH

const searchButton = document.getElementById("searchTrip");

searchButton.addEventListener("click", () => {

    const destination =
        document.getElementById("quickDestination").value.trim();

    const days =
        document.getElementById("quickDays").value;

    const budget =
        document.getElementById("quickBudget").value;

    const travelers =
        document.getElementById("quickTravelers").value;

    if (!destination) {
        alert("Please enter your dream destination!");
        return;
    }

    // Move to the planner and fill its details
    document.getElementById("destination").value = destination;
    document.getElementById("days").value = days;
    document.getElementById("budget").value =
        Number(budget) * Number(travelers);

    document.getElementById("planner").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("destination").focus();
});



 // 3. CONNECT TRIP PLANNER TO PYTHON BACKEND

const plannerForm = document.getElementById("plannerForm");
const plannerResult = document.getElementById("plannerResult");

plannerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const destination = document.getElementById("destination").value.trim();
    const days = Number(document.getElementById("days").value);
    const budget = Number(document.getElementById("budget").value);
    const style = document.getElementById("travelStyle").value;

    if (!destination || !Number.isInteger(days) || days < 1 ||
        !Number.isFinite(budget) || budget < 1000) {
        alert("Please enter valid trip details.");
        return;
    }

    plannerResult.style.display = "block";
    plannerResult.textContent = "🌍 TravelNova is creating your trip plan...";

    try {
        const response = await fetch("http://127.0.0.1:5000/plan-trip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destination: destination,
                days: days,
                budget: budget,
                style: style
            })
        });

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.json();

        let result = `✨ YOUR TRAVELNOVA TRIP PLAN

📍 Destination: ${data.destination}
📅 Duration: ${data.days} Days
💰 Budget: ₹${Number(data.budget).toLocaleString("en-IN")}
🎯 Travel Style: ${data.style}

━━━━━━━━━━━━━━━━━━━━
🗓️ YOUR DAILY ITINERARY
━━━━━━━━━━━━━━━━━━━━

`;

        data.itinerary.forEach(day => {
            result += `DAY ${day.day}

🌅 Morning: ${day.morning}
☀️ Afternoon: ${day.afternoon}
🌙 Evening: ${day.evening}

`;
        });

        result += `
🌍 ${data.message}

Explore More, Worry Less!`;

        plannerResult.textContent = result;

    } catch (error) {
        plannerResult.textContent =
            "Unable to connect to the TravelNova backend. " +
            "Please make sure your Python server is running.";
        console.error(error);
    }

    plannerResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

plannerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const destination =
        document.getElementById("destination").value.trim();

    const days =
        Number(document.getElementById("days").value);

    const budget =
        Number(document.getElementById("budget").value);

    const style =
        document.getElementById("travelStyle").value;

    if (!destination || budget < 1000 || !Number.isFinite(budget)) {
        alert("Please enter a destination and a valid budget.");
        return;
    }

    const formatMoney = amount =>
        "₹" + Math.round(amount).toLocaleString("en-IN");

    // Divide the budget into estimated categories
    const stay = budget * 0.30;
    const food = budget * 0.20;
    const travel = budget * 0.25;
    const activityCost = budget * 0.15;
    const extra = budget * 0.10;

    const plans = {
        Adventure: [
            "Explore the destination and try an outdoor activity.",
            "Discover local adventure spots and scenic viewpoints.",
            "Enjoy an exciting experience and explore nearby attractions."
        ],
        Relaxation: [
            "Arrive, settle in and enjoy a peaceful evening.",
            "Explore relaxing places and enjoy local food.",
            "Spend time discovering beautiful and peaceful surroundings."
        ],
        Culture: [
            "Explore famous landmarks and historical attractions.",
            "Discover local traditions, culture and cuisine.",
            "Visit museums, markets and cultural experiences."
        ],
        Luxury: [
            "Enjoy a comfortable stay and explore premium attractions.",
            "Discover elegant restaurants and beautiful sightseeing spots.",
            "Enjoy a relaxing day with memorable experiences."
        ],
        Nature: [
            "Explore beautiful natural landscapes and viewpoints.",
            "Discover scenic trails, gardens and outdoor locations.",
            "Enjoy nature photography and peaceful surroundings."
        ]
    };

    const activities = plans[style];

    let itinerary = "";

    for (let day = 1; day <= days; day++) {

        const activity = activities[(day - 1) % activities.length];

        itinerary +=
            `DAY ${day}\n` +
            `Morning: ${activity}\n` +
            `Afternoon: Explore local attractions and enjoy lunch.\n` +
            `Evening: Relax, take photographs and discover local food.\n\n`;
    }

    plannerResult.style.display = "block";

    plannerResult.textContent =
        `✨ YOUR TRAVELNOVA TRAVEL PLAN\n\n` +
        `📍 Destination: ${destination}\n` +
        `📅 Duration: ${days} Days\n` +
        `🎯 Travel Style: ${style}\n` +
        `💰 Your Budget: ${formatMoney(budget)}\n\n` +

        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🗓️ YOUR DAY-BY-DAY ITINERARY\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +

        itinerary +

        `━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 ESTIMATED BUDGET BREAKDOWN\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🏨 Accommodation: ${formatMoney(stay)}\n` +
        `🍽️ Food: ${formatMoney(food)}\n` +
        `🚕 Transport: ${formatMoney(travel)}\n` +
        `🎟️ Activities: ${formatMoney(budget * 0.15)}\n` +
        `🛍️ Extra expenses: ${formatMoney(extra)}\n\n` +

        `Total planned budget: ${formatMoney(budget)}\n\n` +

        `🌍 Created with TravelNova.\n` +
        `Explore More, Worry Less!\n\n` +
        `Note: This is a sample AI-style itinerary, not a live AI response. ` +
        `Costs and activities are illustrative estimates, not verified travel prices.`;

    plannerResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});


// 4. SCROLL ANIMATIONS

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


// 5. WELCOME MESSAGE

console.log("TravelNova website loaded successfully!");
console.log("Explore More, Worry Less.");
