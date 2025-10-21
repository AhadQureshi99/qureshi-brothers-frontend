import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import { FaPrint, FaFilter, FaEye } from 'react-icons/fa'
import { BsCalendar } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import img1 from './Images/img1.png'
import img2 from './Images/img2.png'
import { Link } from 'react-router-dom'

const candidate = [
  { id: 1, name: 'Ali Raza', city: 'Karachi', profession: 'Driver', exp: '7 yrs exp', source: 'Email', status: 'Medical Pending', date: '1-1-2025', img: img1 },
  { id: 2, name: 'Sara Malik', city: 'Islamabad', profession: 'Electrician', exp: '3 yrs exp', source: 'Email', status: 'Collect VISA', date: '2-1-2025', img: img2 },
  { id: 3, name: 'Bilal Shah', city: 'Lahore', profession: 'Plumber', exp: '4 yrs exp', source: 'Email', status: 'VISA pending', date: '3-1-2025', img: img1 },
  { id: 4, name: 'Ayesha Khan', city: 'Rawalpindi', profession: 'Carpenter', exp: '6 yrs exp', source: 'Email', status: 'Failed Medical Test', date: '4-1-2025', img: img2 },
  { id: 5, name: 'Hamza Iqbal', city: 'Karachi', profession: 'Electrician', exp: '5 yrs exp', source: 'Email', status: 'Medical Pending', date: '5-1-2025', img: img1 },
  { id: 6, name: 'Nida Qureshi', city: 'Islamabad', profession: 'Welder', exp: '2 yrs exp', source: 'Email', status: 'Collect VISA', date: '6-1-2025', img: img2 },
  { id: 7, name: 'Omar Farooq', city: 'Lahore', profession: 'Electrician', exp: '3 yrs exp', source: 'Email', status: 'VISA pending', date: '7-1-2025', img: img1 },
  { id: 8, name: 'Fatima Zafar', city: 'Rawalpindi', profession: 'Painter', exp: '4 yrs exp', source: 'Email', status: 'Failed Medical Test', date: '8-1-2025', img: img2 },
];

const getStatusColor = (status) => {
  if (status === 'Medical Pending' || status === 'Collect VISA') return 'text-green-600';
  if (status === 'VISA pending') return 'text-orange-500';
  if (status === 'Failed Medical Test') return 'text-red-600';
  return 'text-gray-600';
};

const uniqueValues = (arr, key) => [...new Set(arr.map(item => item[key]))];

const parseDate = (dateStr) => {
  const parts = dateStr.split('-')
  if(parts.length !== 3) return null
  const [d,m,y] = parts
  return new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`)
}

const Candidate = () => {
  const [searchText, setSearchText] = useState('')
  const [filterProfession, setFilterProfession] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)

  const filteredCandidate = candidate.filter(c => {
    // Name search filter (applies on name and profession)
    const searchLower = searchText.toLowerCase()
    const matchesSearch =
      c.name.toLowerCase().includes(searchLower) ||
      c.profession.toLowerCase().includes(searchLower)
    if (!matchesSearch) return false

    // Profession filter
    if (filterProfession !== 'all' && c.profession !== filterProfession) return false

    // Status filter
    if (filterStatus !== 'all' && c.status !== filterStatus) return false

    // Date filter
    const cDate = parseDate(c.date)
    const fromDate = filterDateFrom ? new Date(filterDateFrom) : null
    const toDate = filterDateTo ? new Date(filterDateTo) : null
    if (fromDate && cDate < fromDate) return false
    if (toDate && cDate > toDate) return false

    return true
  })

  const resetFilters = () => {
    setFilterProfession('all')
    setFilterStatus('all')
    setFilterDateFrom('')
    setFilterDateTo('')
  }

  return (
    <div>
      <div className="flex min-h-screen">
        <div className="w-[20%]">
          <Sidebar />
        </div>

        <div className="w-[80%] p-6 space-y-6 bg-gray-50 relative">
          {/* Search & Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-green-100 p-4 rounded-lg mb-4">
            <input
              type="text"
              placeholder="Search by Candidate name or Profession"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md outline-none"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <div className="flex gap-2 relative">
              <button
                className="bg-green-600 text-white px-8 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                <FaFilter /> Filter
              </button>
           <button className="bg-green-600 text-white px-8 py-2 rounded-md flex items-center gap-2 hover:bg-green-700">
                <FaPrint /> Print
              </button>

              {/* Filter dropdown */}
              {filterVisible && (
                <div className="absolute top-full right-0 mt-12 w-72 bg-white rounded shadow-lg border border-gray-300 z-20 p-4">
                  <div className="mb-3">
                    <label className="block font-semibold mb-1">Profession</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterProfession}
                      onChange={e => setFilterProfession(e.target.value)}
                    >
                      <option value="all">All</option>
                      {uniqueValues(candidate, 'profession').map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block font-semibold mb-1">Status</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      {uniqueValues(candidate, 'status').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block font-semibold mb-1">Date From</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterDateFrom}
                      onChange={e => setFilterDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block font-semibold mb-1">Date To</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={filterDateTo}
                      onChange={e => setFilterDateTo(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded"
                      onClick={() => {
                        resetFilters()
                        setFilterVisible(false)
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded"
                      onClick={() => setFilterVisible(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-md text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">NO#</th>
                  <th className="p-3 border">Candidates</th>
                  <th className="p-3 border">Profession</th>
                  <th className="p-3 border">Source</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Received Date</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidate.length > 0 ? (
                  filteredCandidate.map((c, index) => (
                    <tr key={c.id} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">{String(index + 1).padStart(2, '0')}</td>

                      <td className="p-2 border flex items-center gap-2">
                        <img src={c.img} alt="profile" className="w-8 h-8 rounded-full" />
                        <div className="text-left">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.city}</p>
                        </div>
                      </td>

                      <td className="p-2 border">
                        <p className="font-medium">{c.profession}</p>
                        <p className="text-xs text-gray-500">{c.exp}</p>
                      </td>

                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-1">
                          <MdEmail className="text-xl text-gray-700" />
                          <span>{c.source}</span>
                        </div>
                      </td>

                      <td className={`p-2 border font-medium ${getStatusColor(c.status)}`}>
                        {c.status}
                      </td>

                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-1">
                          <BsCalendar className="text-sm" />
                          <span>{c.date}</span>
                        </div>
                      </td>

                      <td className="p-2 border">
                        <div className="flex items-center justify-center gap-2">
                          <Link to="/CandidatesCV">
                            <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                              <FaEye />
                            </button>
                          </Link>
                          <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Candidate