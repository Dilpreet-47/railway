import { useState } from "react";

const App = () => {
  const [trainNumber, setTrainNumber] = useState(""); // input
  const [trainData, setTrainData] = useState(null);   // API response
  const [loading, setLoading] = useState(false);      // loading spinner
  const [error, setError] = useState(null);           // error handling

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
        `https://rappid.in/apis/train.php?train_no=${trainNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text); // try JSON
      } catch {
        data = { message: text }; // fallback to plain text
      }

      setTrainData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🚆 Train Info Finder
        </h1>

        {/* Input + Button */}
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

        {/* Loading spinner */}
        {loading && <p className="text-blue-500 text-center">Loading...</p>}

        {/* Error message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Train data */}
        {trainData && (
          <div className="mt-4 p-4 bg-gray-50 border rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(trainData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
