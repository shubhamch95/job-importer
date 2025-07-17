'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:9000/api/import-logs');
        const data = await res.json();
        setLogs(data || []);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Import History Logs</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500">No logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="p-3">Source URL</th>
                <th className="p-3">Total</th>
                <th className="p-3">New</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Failed</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {logs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="p-3 max-w-xs break-words">{log.sourceUrl}</td>
                  <td className="p-3">{log.totalFetched}</td>
                  <td className="p-3 text-green-600">{log.newJobs}</td>
                  <td className="p-3 text-blue-600">{log.updatedJobs}</td>
                  <td className="p-3 text-red-600">{log.failedJobs?.length}</td>
                  <td className="p-3">
                    {new Date(log.timeStamp).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}