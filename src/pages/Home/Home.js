import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Accordion } from '../../components/Accordion/Accordion';
import { groupByKey } from '../../utils/groupData';

const Home = () => {
  const [data, setData] = useState([]);
  const [groupKey, setGroupKey] = useState("Suburb - Incident");

  useEffect(() => {
    fetch('/data/crime_record.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => setData(results.data),
        });
      });
  }, []);

  const grouped = groupByKey(data, groupKey);

  const getHeaders = (data) => {
    if (data.length > 0) {
      return Object.keys(data[0]).filter(header => header !== "_id");
    }
    return [];
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Crime Records</h1>

      <button
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
        onClick={() =>
          setGroupKey(
            groupKey === "Suburb - Incident"
              ? "Offence Level 2 Description"
              : "Suburb - Incident"
          )
        }
      >
        Regroup by <span className="font-semibold">{groupKey === "Suburb - Incident"
          ? "Offence Level 2 Description"
          : "Suburb - Incident"}</span>
      </button>

      <div className="space-y-4">
        {Object.entries(grouped).map(([group, records]) => (
          <Accordion key={group} title={`${group} (${records.length})`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm bg-white border rounded-lg shadow-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    {getHeaders(records).map((header, index) => (
                      <th key={index} className="text-left px-4 py-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((item, i) => (
                    <tr
                      key={`item_${i}`}
                      className="border-t hover:bg-blue-50"
                    >
                      {getHeaders(records).map((header, index) => (
                        <td key={index} className="px-4 py-2">{item[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Home;
