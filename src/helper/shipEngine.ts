import ShipEngine from "shipengine";

// Initialize ShipEngine with your API key
const shipEngine = new ShipEngine({
    apiKey: process.env.SHIPENGINE_API_KEY as string,
});

export { shipEngine };