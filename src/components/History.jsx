export default function History({ historyData }) {
  if (historyData.length === 0) {
    return (
      <div className="grow flex items-center justify-center">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No history data available.
        </p>
      </div>
    );
  }

  const totalProfitLoss = historyData.reduce(
    (acc, item) => acc + item.profit_loss,
    0
  );

  return (
    <div>
      <div className="mb-2 mx-2 p-2 rounded-md bg-gray-100 dark:bg-gray-900 text-center">
        <p
          className={`font-semibold ${
            totalProfitLoss < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          Total: {Math.round(totalProfitLoss * 100) / 100}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2 pb-2">
        {historyData
          .slice()
          .reverse()
          .map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-200 dark:bg-gray-800 flex flex-col justify-between rounded-md shadow-sm dark:shadow-none"
            >
              <div className="flex flex-row justify-between w-full">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200">
                  {item.symbol}
                </h2>
                <p
                  className={`${
                    item.profit_loss < 0 ? "text-red-500 " : "text-green-500"
                  }`}
                >
                  {item.profit_loss}
                </p>
              </div>

              <div className="flex flex-row flex-wrap space-x-4">
                <p
                  className={`text-sm ${
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
                  Exit: {item.exit}
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
