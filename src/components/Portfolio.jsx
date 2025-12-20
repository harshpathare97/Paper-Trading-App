export default function Portfolio({ portfolioData }) {
  if (portfolioData.length === 0) {
    return (
      <div className="grow flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No portfolio data available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2 pb-2">
      {portfolioData.map((item, i) => (
        <div
          key={i}
          className="p-2 bg-gray-200 dark:bg-gray-800 flex flex-col justify-between rounded-md shadow-sm dark:shadow-none"
        >
          <div className="flex flex-row justify-between w-full">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
              {item.symbol}
            </h3>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 dark:text-blue-400 underline"
            >
              Chart
            </a>
          </div>

          <div className="mt-2">
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-1">
              <p
                className={`text-sm ${
                  item.signal_type === "BUY"
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 drak:text-red-400"
                }`}
              >
                {item.signal_type}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Entry: {item.entry}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Take Profit: {item.take_profit}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stop Loss: {item.stop_loss}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
