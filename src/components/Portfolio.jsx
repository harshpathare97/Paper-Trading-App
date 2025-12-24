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
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-gray-200 dark:bg-gray-800 flex flex-col justify-between rounded-md shadow-sm dark:shadow-none"
        >
          <div className="flex flex-row justify-between w-full">
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              {item.symbol}
            </div>
            <p
              className={`${
                item.candle === "green" ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.candle === "green" ? "+" : "-"}
              {item.close}
            </p>
          </div>
            <div className="flex flex-row flex-wrap gap-x-4">
              <p
                className={` ${
                  item.signal === "BUY"
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 drak:text-red-400"
                }`}
              >
                {item.signal}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Entry: {item.entry}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Target: {item.target}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stop Loss: {item.stop_loss}
              </p>
            </div>
        </a>
      ))}
    </div>
  );
}
