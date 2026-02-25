import { ShoppingCart, Package, Users, BarChart3, TrendingUp, TrendingDown } from "lucide-react"
import RevenueTrend from "@/components/analytics/revenueTrend"
import WeeklyData from "@/components/analytics/weeklyData"
import DeliveryStats from "@/components/analytics/deliveryStats"
import DeliveryTimes from "@/components/analytics/deliveryTimes"
import VendorPerformance from "@/components/analytics/vendorPerformance"
import LiveOrders from "@/components/analytics/liveOrders"
import PeakHours from "@/components/analytics/peakHOurs"
import SystemHealth from "@/components/analytics/systemHealth"

const stats = [
  {
    name: "Total Orders",
    value: "2,847",
    change: "+12.5%",
    changeType: "increase",
    icon: ShoppingCart,
  },
  {
    name: "Active Vendors",
    value: "156",
    change: "+3.2%",
    changeType: "increase",
    icon: Package,
  },
  {
    name: "Total Users",
    value: "12,847",
    change: "+8.1%",
    changeType: "increase",
    icon: Users,
  },
  {
    name: "Revenue",
    value: "$47,892",
    change: "-2.4%",
    changeType: "decrease",
    icon: BarChart3,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive insights into your Drop delivery platform performance.
        </p>
      </div>

     
      {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isIncrease = stat.changeType === "increase"

          return (
            <div
              key={stat.name}
              className="rounded-lg  bg-white p-4 shadow-lg hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-1 text-sm">
                {isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={isIncrease ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          )
        })}
      </div> */}

     
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueTrend />
        <WeeklyData />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeliveryTimes />
        <DeliveryStats />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VendorPerformance />
      <LiveOrders /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <SystemHealth/>
  <PeakHours />
 
</div>
    </div>
  )
}
