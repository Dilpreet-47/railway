import { useState } from "react";

const App = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainData = async () => {
    if (!trainNumber) {
      setError("Please enter a train number");
      return;
    }
    setLoading(true);
    setError(null);
    setTrainData(null);

    try {
      const response = await fetch(
        `/api/train.php?train_no=${trainNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
      setTrainData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTrainData = () => {
    if (!trainData) return null;

    // Assuming trainData has properties like trainName, trainNumber, schedule, etc.
    const { trainName, trainNumber: number, schedule } = trainData;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {trainName} ({number})
        </h2>
        
        {schedule && schedule.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
              Route Schedule
            </h3>
            <div className="space-y-4">
              {schedule.map((station, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-blue-200"></div>
                    {index < schedule.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-900">{station.stationName}</p>
                    <p className="text-sm text-gray-600">
                      Arrival: {station.arrivalTime || "N/A"} | Departure: {station.departureTime || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Platform: {station.platform || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 p-6">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🚆 Train Info Finder
        </h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter train number"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
          />
          <button
            onClick={fetchTrainData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Data
          </button>
        </div>
        {loading && <p className="text-blue-500 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      <div className="flex-1 mt-4 p-4 rounded-lg overflow-auto">
        {renderTrainData()}
      </div>
    </div>
  );
};

export default App;