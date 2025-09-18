"use client"

export default function SystemHealth() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">System Health</h2>
      <p className="text-sm text-gray-500 mb-4">Platform status and performance</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>API Response Time</span>
          <span className="font-semibold text-blue-600">125ms</span>
        </div>
        <div className="flex justify-between">
          <span>Database Performance</span>
          <span className="font-semibold text-blue-600">Optimal</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Success Rate</span>
          <span className="font-semibold text-blue-600">99.2%</span>
        </div>
        <div className="flex justify-between">
          <span>Active Sessions</span>
          <span className="font-semibold text-blue-600">1,247</span>
        </div>
      </div>
    </div>
  )
}
