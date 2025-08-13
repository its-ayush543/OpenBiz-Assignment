'use client';
import React, { useEffect, useState } from 'react';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/submissions`
        );
        if (!res.ok) throw new Error('Failed to fetch submissions');
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">All Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2">ID</th>
                <th className="border border-gray-300 px-3 py-2">Aadhaar</th>
                <th className="border border-gray-300 px-3 py-2">Name</th>
                <th className="border border-gray-300 px-3 py-2">Consent</th>
                <th className="border border-gray-300 px-3 py-2">PAN</th>
                <th className="border border-gray-300 px-3 py-2">ITR Filed</th>
                <th className="border border-gray-300 px-3 py-2">GST Registered</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{sub.id}</td>
                  <td className="border border-gray-300 px-3 py-2">{sub.aadhaarNumber}</td>
                  <td className="border border-gray-300 px-3 py-2">{sub.nameAsPerAadhaar}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    {sub.consent ? 'Yes' : 'No'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">{sub.pan}</td>
                  <td className="border border-gray-300 px-3 py-2">{sub.itrFiled}</td>
                  <td className="border border-gray-300 px-3 py-2">{sub.gstRegistered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
