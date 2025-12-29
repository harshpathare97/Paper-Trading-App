import { useEffect, useState } from "react";
import Portfolio from "./components/Portfolio";
import History from "./components/History";

export default function App() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [isPortfolio, setIsPortflio] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const scan = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/scan").then((response) => {
      if (response.status === 204) {
        fetchData();
      }
    });
  };

  const fetchData = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/data")
      .then((response) => response.json())
      .then((data) => {
        setPortfolioData(data.portfolio);
        setHistoryData(data.history);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* header */}
      <div
        className="bg-blue-600 dark:bg-blue-800 p-4 shadow-md"
        onClick={() => scan()}
      >
        <h1 className="text-white text-2xl font-semibold text-center">
          Paper Trading App
        </h1>
      </div>
      <div className="sticky top-0 z-20 flex justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-row bg-gray-200 dark:bg-gray-800 p-1 rounded-full gap-2">
          <button
            className={`text-lg font-semibold text-center py-2 px-4 rounded-full cursor-pointer ${
              isPortfolio
                ? "bg-white text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
            onClick={() => setIsPortflio(true)}
          >
            Portfolio
          </button>
          <button
            className={`text-md font-semibold text-center py-2 px-4 rounded-full cursor-pointer ${
              !isPortfolio
                ? "bg-white text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
            onClick={() => setIsPortflio(false)}
          >
            History
          </button>
        </div>
      </div>

      {/* components */}
      {loading ? (
        <div className="flex flex-col grow items-center justify-center">
          <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col grow items-center justify-center space-y-4">
          <div>
            <p className="text-lg text-center text-red-500">
              503 Service temporarily unavailable.
            </p>
            <p className="text-lg text-center text-red-500">
              Please try again later
            </p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchData();
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {isPortfolio ? (
            <Portfolio portfolioData={portfolioData} />
          ) : (
            <History historyData={historyData} />
          )}
        </>
      )}
    </div>
  );
}
