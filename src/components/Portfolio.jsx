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
          className="group flex flex-col gap-3 p-3
        bg-white dark:bg-gray-800
        rounded-xl border border-gray-200 dark:border-gray-700
        shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="space-x-3 flex items-center">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {item.symbol}
            </span>

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
            </div>

            <span
              className={`text-sm font-semibold ${
                item.candle === "green" ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.candle === "green" ? "▲" : "▼"} {item.close}
            </span>
          </div>

          <div className="text-sm flex flex-row space-x-3 items-center">
            <p className="text-gray-500 dark:text-gray-400">
              Entry:
              <span className="ml-1 text-gray-900 dark:text-gray-200">
                {item.entry}
              </span>
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Target:
              <span className="ml-1 text-gray-900 dark:text-gray-200">
                {item.target}
              </span>
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Stop Loss:
              <span className="ml-1 text-gray-900 dark:text-gray-200">
                {item.stop_loss}
              </span>
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
