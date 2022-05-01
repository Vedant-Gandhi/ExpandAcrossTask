import "./App.css";
import { useEffect, useState } from "react";
import { getTransactions } from "./Network";

function App() {
  const [data, updateData] = useState([]);
  const [displayData, updateDisplayData] = useState([]);
  const [filters, updateFilters] = useState(null);
  const [filterElement, updatefilterElement] = useState(null);
  const [filterValue, updatefilterValue] = useState("");

  //Fetch the JSON file from the network and store the first 500 entries
  useEffect(() => {
    getTransactions()
      .then((transactions) => {
        updateData(transactions?.slice(0, 500) || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //Get the copy of data and store it
  useEffect(() => {
    console.log(data);
    updateDisplayData(data);
  }, [data]);

  useEffect(() => {
    updatefilterValue(null);
    switch (filters) {
      case "disclosure_year":
        updatefilterElement(
          <select
            className="w-64 border outline-none p-2 px-4"
            onChange={(e) => {
              updatefilterValue(e.target.value);
            }}
          >
            {[...range(1950, 2022)].map((value) => {
              return <option value={value}>{value}</option>;
            })}
          </select>
        );
        break;
      case "representative":
      case "district":
      case "ticker":
        updatefilterElement(
          <input
            className="w-64 border border-slate-500 outline-none p-2 px-4"
            type={"text"}
            onChange={(e) => {
              updatefilterValue(e.target.value);
            }}
            placeholder={filters}
          ></input>
        );
        break;
      default:
        updatefilterElement(null);
        updatefilterValue("");
        updateDisplayData(data);
        return;
    }
  }, [filters]);

  useEffect(() => {
    if (filterValue) {
      switch (filters) {
        case "disclosure_year":
          updateDisplayData(
            data.filter(
              (a) =>
                parseInt(a.disclosure_year) === parseInt(filterValue || "0")
            )
          );
          break;

        case "ticker":
        case "representative":
        case "district":
          updateDisplayData(
            data.filter(
              (val) =>
                filterValue?.toUpperCase() === val?.[filters]?.toUpperCase()
            )
          );
          break;
      }
    } else {
      updateDisplayData(data);
    }
  }, [filterValue]);

  function* range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }

  const numberSort = (a, b) => {
    return a - b;
  };
  const dateSort = (a, b) => {
    return new Date(a) - new Date(b);
  };
  /**
   *
   * @param {string} a
   * @param {string} b
   * @returns
   */
  const textSort = (a, b) => {
    let aUp = a.toUpperCase();
    let bUp = b.toUpperCase();

    if (aUp < bUp) return -1;
    if (aUp === bUp) return 0;
    return 1;
  };
  /**
 {
    "disclosure_year": 2021,
    "disclosure_date": "10/04/2021",
    "transaction_date": "2021-09-27",
    "owner": "joint",
    "ticker": "BP",
    "asset_description": "BP plc",
    "type": "purchase",
    "amount": "$1,001 - $15,000",
    "representative": "Hon. Virginia Foxx",
    "district": "NC05",
    "ptr_link": "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2021/20019557.pdf",
    "cap_gains_over_200_usd": false
}
 */
  return (
    <div className="w-full flex items-center justify-center  flex-col">
      <div className="flex items-center">
        <label htmlFor="Filter">Filter:</label>
        <select
          id="Filter"
          className="px-5 py-2 m-3 my-8 outline-none rounded bg-gray-50 border border-slate-200  shadow"
          onChange={(e) => {
            updateFilters(e.target.value);
          }}
        >
          <option value={""}>None</option>
          <option value={"disclosure_year"}>Disclosure Year</option>
          <option value={"ticker"}>Ticker</option>
          <option value={"representative"}>Representative</option>
          <option value={"district"}>District</option>
        </select>
        <div className="min-w-[16rem] min-h-[2px]">
          {filterElement && filterElement}
        </div>
      </div>
      {displayData?.length > 0 ? (
        <table className=" border-collapse border-slate-500 w-4/5">
          <thead className="">
            <tr>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) =>
                    numberSort(a.disclosure_year, b.disclosure_year)
                  );
                  updateData(displayData);
                }}
              >
                Disclosure Year
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) =>
                    dateSort(a.disclosure_date, b.disclosure_date)
                  );
                  updateData(displayData);
                }}
              >
                Disclosure Date
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) =>
                    dateSort(a.disclosure_date, b.disclosure_date)
                  );
                  updateData(displayData);
                }}
              >
                Transaction Date
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) => textSort(a.owner, b.owner));
                  updateData(displayData);
                }}
              >
                Owner
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) => textSort(a.ticker, b.ticker));
                  updateData(displayData);
                }}
              >
                Ticker
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) =>
                    textSort(a.asset_description, b.asset_description)
                  );
                  updateData(displayData);
                }}
              >
                Asset description
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) => textSort(a.type, b.type));
                  updateData(displayData);
                }}
              >
                Type
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) => textSort(a.amount, b.amount));
                  updateData(displayData);
                }}
              >
                Amount
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) =>
                    textSort(a.representative, b.representative)
                  );

                  updateData(displayData);
                }}
              >
                Representative
              </th>
              <th
                className="border border-slate-500"
                onClick={(e) => {
                  displayData?.sort((a, b) => textSort(a.district, b.district));
                  updateData(displayData);
                }}
              >
                District
              </th>
              <th className="border border-slate-500">Ptr Link</th>
              <th className="border border-slate-500">Cap gains over 200</th>
            </tr>
          </thead>
          <tbody>
            {/** Fetches a single object from the data */}
            {displayData?.map((entry) => (
              <tr>
                <td className="border border-slate-700">
                  {entry.disclosure_year}
                </td>
                <td className="border border-slate-700">
                  {entry.disclosure_date}
                </td>
                <td className="border border-slate-700">
                  {entry.transaction_date}
                </td>
                <td className="border border-slate-700">
                  {entry.owner || "-"}
                </td>
                <td className="border border-slate-700">{entry.ticker}</td>
                <td className="border border-slate-700">
                  {entry.asset_description}
                </td>
                <td className="border border-slate-700">{entry.type}</td>
                <td className="border border-slate-700">{entry.amount}</td>
                <td className="border border-slate-700">
                  {entry.representative}
                </td>
                <td className="border border-slate-700">{entry.district}</td>
                <td className="border border-slate-700">{entry.ptr_link}</td>
                <td className="border border-slate-700">
                  {entry.cap_gains_over_200_usd ? (
                    <span className="text-green-600 font-bold">True</span>
                  ) : (
                    <span className="text-red-600 font-bold">False</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
          disabled=""
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </button>
      )}
    </div>
  );
}

export default App;
