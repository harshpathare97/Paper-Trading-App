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
      {/* Total P/L */}
      <div
        className="mx-2 rounded-xl bg-white dark:bg-gray-900 p-2 text-center
                  border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <p
          className={`text-lg font-semibold ${
            totalProfitLoss < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          Total P/L: {Math.round(totalProfitLoss * 100) / 100}
        </p>
      </div>

      {/* History List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 pb-2">
        {historyData
          .slice()
          .reverse()
          .map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 p-3
            bg-white dark:bg-gray-800
            rounded-xl border border-gray-200 dark:border-gray-700
            shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.symbol}
                </h2>

                <span
                  className={`text-sm font-bold ${
                    item.profit_loss < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {item.profit_loss}
                </span>
              </div>

              <div className="text-sm flex flex-row space-x-3 items-center">
                <span
                  className={`inline-block px-2 py-1 text-xs font-bold rounded-full
                ${
                  item.signal === "BUY"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                }`}
                >
                  {item.signal}
                </span>
                <p className="text-gray-500 dark:text-gray-400">
                  Entry:
                  <span className="ml-1 text-gray-900 dark:text-gray-200">
                    {item.entry}
                  </span>
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Exit:
                  <span className="ml-1 text-gray-900 dark:text-gray-200">
                    {item.exit}
                  </span>
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
