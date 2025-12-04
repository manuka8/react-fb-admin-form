import React, { useEffect, useState } from 'react'

export default function AdminDashboard(){
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    withExperience: 0,
    highSalary: 0
  })
  const [selectedApp, setSelectedApp] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  async function fetchApps(){
    setLoading(true)
    setErr(null)
    const token = localStorage.getItem('admin_token') || ''
    
    try {
      const res = await fetch('/api/applications', { 
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json'
        } 
      })
      
      if(res.ok){
        const data = await res.json()
        setApps(data)
        calculateStats(data)
      } else {
        const data = await res.json()
        setErr(data.message || 'Failed to fetch applications')
      }
    } catch(e) { 
      setErr('Network error. Please check your connection.')
      console.error('Fetch error:', e)
    }
    setLoading(false)
  }

  function calculateStats(applications) {
    const today = new Date().toDateString()
    const todayApps = applications.filter(app => 
      new Date(app.createdAt).toDateString() === today
    )
    
    const withExperience = applications.filter(app => 
      app.smm_experience && app.smm_experience > 0
    ).length
    
    const highSalary = applications.filter(app => 
      app.expected_salary && app.expected_salary >= 2000
    ).length
    
    setStats({
      total: applications.length,
      today: todayApps.length,
      withExperience,
      highSalary
    })
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getFilteredAndSortedApps() {
    let filtered = apps.filter(app => 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filtered.sort((a, b) => {
      let aValue, bValue
      
      switch(sortBy) {
        case 'name':
          aValue = a.fullName || ''
          bValue = b.fullName || ''
          break
        case 'date':
          aValue = new Date(a.createdAt || 0)
          bValue = new Date(b.createdAt || 0)
          break
        case 'experience':
          aValue = a.smm_experience || 0
          bValue = b.smm_experience || 0
          break
        case 'salary':
          aValue = a.expected_salary || 0
          bValue = b.expected_salary || 0
          break
        default:
          aValue = new Date(a.createdAt || 0)
          bValue = new Date(b.createdAt || 0)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  function exportToCSV() {
    const headers = [
      'Name', 'Email', 'Phone', 'Age', 'City', 'Employment Status',
      'Gender', 'SMM Experience', 'Managed Pages', 'Graphic Design',
      'FB Ads Exp', 'Expected Salary', 'Applied Date'
    ]
    
    const csvData = apps.map(app => [
      app.fullName || '',
      app.email || '',
      app.phone || '',
      app.age || '',
      app.city || '',
      app.employed || '',
      app.gender || '',
      app.smm_experience || '',
      app.managed_pages || '',
      app.graphic_designs || '',
      app.fb_ads || '',
      app.expected_salary || '',
      formatDate(app.createdAt)
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchApps()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchApps, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredApps = getFilteredAndSortedApps()

  return (
    <section className="card fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600">Manage and review applications</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV} 
            className="btn-secondary"
            disabled={apps.length === 0}
          >
            <i className="fas fa-file-export"></i> Export CSV
          </button>
          <button 
            onClick={fetchApps} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span> Refreshing...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt"></i> Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Applications</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="text-primary text-3xl">
              <i className="fas fa-file-alt"></i>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <i className="fas fa-calendar-day"></i> {stats.today} today
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">With Experience</p>
              <p className="stat-value">{stats.withExperience}</p>
            </div>
            <div className="text-success text-3xl">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {stats.total > 0 ? `${Math.round((stats.withExperience / stats.total) * 100)}% of total` : 'No data'}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">High Salary Apps</p>
              <p className="stat-value">{stats.highSalary}</p>
            </div>
            <div className="text-warning text-3xl">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Salary ≥ $2,000/month
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Avg. Experience</p>
              <p className="stat-value">
                {apps.length > 0 
                  ? (apps.reduce((sum, app) => sum + (app.smm_experience || 0), 0) / apps.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <div className="text-secondary text-3xl">
              <i className="fas fa-user-clock"></i>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Average years of experience
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
              <option value="salary">Sort by Salary</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 border rounded-md hover:bg-gray-100 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <i className={`fas fa-sort-amount-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {err && (
        <div className="error p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{err}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && apps.length === 0 ? (
        <div className="text-center py-12">
          <div className="loading mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : (
        <>
          {/* Applications Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Applicant
                      {sortBy === 'name' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} text-primary`}></i>
                      )}
                    </div>
                  </th>
                  <th className="p-4 text-left">Contact</th>
                  <th className="p-4 text-left">Location</th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('experience')}
                  >
                    <div className="flex items-center gap-2">
                      Experience
                      {sortBy === 'experience' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} text-primary`}></i>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('salary')}
                  >
                    <div className="flex items-center gap-2">
                      Expected Salary
                      {sortBy === 'salary' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} text-primary`}></i>
                      )}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Applied
                      {sortBy === 'date' && (
                        <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} text-primary`}></i>
                      )}
                    </div>
                  </th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      <i className="fas fa-inbox text-4xl mb-3 block text-gray-300"></i>
                      {searchTerm ? 'No applications match your search.' : 'No applications found.'}
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{app.fullName}</div>
                        <div className="text-sm text-gray-600">{app.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <i className="fas fa-phone text-gray-400"></i>
                          {app.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">{app.city}</div>
                        <div className="text-sm text-gray-500">{app.gender}, {app.age} yrs</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{app.smm_experience || 0} years</div>
                        <div className="text-sm text-gray-500">
                          {app.managed_pages === 'Yes' ? (
                            <span className="text-success">
                              <i className="fas fa-check-circle"></i> Managed pages
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              <i className="fas fa-times-circle"></i> No page experience
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-primary">${app.expected_salary?.toLocaleString() || '0'}</div>
                        <div className="text-sm text-gray-500">
                          {app.graphic_designs === 'Yes' ? (
                            <span className="text-success">
                              <i className="fas fa-paint-brush"></i> Graphic design
                            </span>
                          ) : null}
                          {app.fb_ads === 'Yes' && (
                            <span className="text-info ml-2">
                              <i className="fas fa-ad"></i> FB Ads
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">{formatDate(app.createdAt)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(app.createdAt).toDateString() === new Date().toDateString() ? (
                            <span className="text-success font-semibold">Today</span>
                          ) : (
                            `${Math.floor((new Date() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24))} days ago`
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-primary hover:bg-blue-50 rounded-md transition-colors"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <a
                            href={`mailto:${app.email}`}
                            className="p-2 text-success hover:bg-green-50 rounded-md transition-colors"
                            title="Send Email"
                          >
                            <i className="fas fa-envelope"></i>
                          </a>
                          <button
                            onClick={() => window.open(`tel:${app.phone}`, '_blank')}
                            className="p-2 text-info hover:bg-cyan-50 rounded-md transition-colors"
                            title="Call"
                          >
                            <i className="fas fa-phone"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          {filteredApps.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <div>
                Showing <span className="font-semibold">{filteredApps.length}</span> of{' '}
                <span className="font-semibold">{apps.length}</span> applications
                {searchTerm && (
                  <span className="ml-2">
                    (filtered from {apps.length} total)
                  </span>
                )}
              </div>
              <div>
                Sorted by <span className="font-semibold">{sortBy}</span>{' '}
                (<span className="font-semibold">{sortOrder === 'asc' ? 'ascending' : 'descending'}</span>)
              </div>
            </div>
          )}
        </>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>
            
            <div className="p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-primary">
                  <i className="fas fa-user mr-2"></i>Personal Information
                </h4>
                <div className="grid grid-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-medium">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Age</label>
                    <p className="font-medium">{selectedApp.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">City</label>
                    <p className="font-medium">{selectedApp.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Employment Status</label>
                    <p className="font-medium">{selectedApp.employed}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender</label>
                    <p className="font-medium">{selectedApp.gender}</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-primary">
                  <i className="fas fa-chart-line mr-2"></i>Experience & Skills
                </h4>
                <div className="grid grid-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-500">SMM Experience</label>
                    <p className="font-medium">{selectedApp.smm_experience || 0} years</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Managed FB Pages</label>
                    <p className={`font-medium ${selectedApp.managed_pages === 'Yes' ? 'text-success' : 'text-gray-600'}`}>
                      {selectedApp.managed_pages}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Graphic Design</label>
                    <p className={`font-medium ${selectedApp.graphic_designs === 'Yes' ? 'text-success' : 'text-gray-600'}`}>
                      {selectedApp.graphic_designs}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Facebook Ads</label>
                    <p className={`font-medium ${selectedApp.fb_ads === 'Yes' ? 'text-success' : 'text-gray-600'}`}>
                      {selectedApp.fb_ads}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-500 block mb-2">Previous Experience</label>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedApp.previous_experience || 'No description provided'}
                  </div>
                </div>
                
                {selectedApp.page_links && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-500 block mb-2">Managed Pages Links</label>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {selectedApp.page_links}
                    </div>
                  </div>
                )}
                
                {selectedApp.ads_experience && (
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Ads Experience</label>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {selectedApp.ads_experience}
                    </div>
                  </div>
                )}
              </div>

              {/* Knowledge */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-primary">
                  <i className="fas fa-lightbulb mr-2"></i>Knowledge & Strategy
                </h4>
                <div className="grid grid-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-500">Posting Frequency</label>
                    <p className="font-medium">{selectedApp.posting_frequency}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Best Post Time</label>
                    <p className="font-medium">{selectedApp.best_post_time}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Meta Suite Skill</label>
                    <p className="font-medium">{selectedApp.meta_skill}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-500 block mb-2">Organic Engagement Strategy</label>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedApp.organic_engagement}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-500 block mb-2">Negative Comment Handling</label>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedApp.negative_comments}
                  </div>
                </div>
              </div>

              {/* Salary & Comments */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-primary">
                  <i className="fas fa-dollar-sign mr-2"></i>Compensation & Comments
                </h4>
                <div className="mb-4">
                  <label className="text-sm text-gray-500">Expected Salary</label>
                  <p className="text-2xl font-bold text-primary">${selectedApp.expected_salary?.toLocaleString() || '0'} / month</p>
                </div>
                
                {selectedApp.comments && (
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Additional Comments</label>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {selectedApp.comments}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t p-6 flex justify-between">
              <div className="text-sm text-gray-500">
                Applied on {formatDate(selectedApp.createdAt)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedApp.email}`}
                  className="btn-primary"
                >
                  <i className="fas fa-envelope mr-2"></i>Contact Applicant
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
