'use client'

export default function DashboardContent() {
    const stats = [
        { name: 'Total Sales Today', value: '$12,345', change: '+4.75%', changeType: 'positive' },
        { name: 'Medicines Sold', value: '847', change: '+12.02%', changeType: 'positive' },
        { name: 'Low Stock Items', value: '23', change: '-2.1%', changeType: 'negative' },
        { name: 'Active Customers', value: '156', change: '+8.4%', changeType: 'positive' },
    ]

    const recentOrders = [
        { id: '001', customer: 'John Smith', medicines: 3, total: '$89.50', status: 'completed' },
        { id: '002', customer: 'Sarah Johnson', medicines: 1, total: '$24.99', status: 'pending' },
        { id: '003', customer: 'Mike Davis', medicines: 5, total: '$156.75', status: 'completed' },
        { id: '004', customer: 'Emma Wilson', medicines: 2, total: '$67.20', status: 'processing' },
    ]

    const lowStockItems = [
        { name: 'Paracetamol 500mg', current: 12, minimum: 50, supplier: 'MedSupply Co' },
        { name: 'Vitamin D3', current: 8, minimum: 25, supplier: 'HealthCorp' },
        { name: 'Aspirin 75mg', current: 15, minimum: 40, supplier: 'PharmaDist' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="border-b border-gray-800 pb-6">
                <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
                <p className="mt-2 text-gray-400">Welcome back! Here's what's happening at your pharmacy today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="card">
                        <div className="card-content">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-400 truncate">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span
                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${stat.changeType === 'positive'
                                            ? 'bg-success-900 text-success-300'
                                            : 'bg-error-900 text-error-300'
                                        }`}
                                >
                                    {stat.change}
                                </span>
                                <span className="text-xs text-gray-400 ml-2">vs last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-medium text-gray-100">Recent Orders</h3>
                        <p className="text-sm text-gray-400">Latest billing transactions</p>
                    </div>
                    <div className="card-content">
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-100">{order.customer}</p>
                                        <p className="text-sm text-gray-400">{order.medicines} medicines • Order #{order.id}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium text-gray-100">{order.total}</span>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'completed'
                                                    ? 'bg-success-900 text-success-300'
                                                    : order.status === 'pending'
                                                        ? 'bg-warning-900 text-warning-300'
                                                        : 'bg-primary-900 text-primary-300'
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <a
                                href="/billing"
                                className="btn-primary w-full justify-center inline-flex items-center"
                            >
                                View All Orders
                            </a>
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-medium text-gray-100">Low Stock Alert</h3>
                        <p className="text-sm text-gray-400">Items requiring attention</p>
                    </div>
                    <div className="card-content">
                        <div className="space-y-4">
                            {lowStockItems.map((item) => (
                                <div key={item.name} className="p-4 bg-error-900/20 border border-error-800 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-100">{item.name}</p>
                                            <p className="text-sm text-gray-400">Supplier: {item.supplier}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-error-300">
                                                {item.current} / {item.minimum}
                                            </p>
                                            <p className="text-xs text-gray-400">current / min</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-400">Stock Level</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-error-500 h-2 rounded-full"
                                                style={{ width: `${(item.current / item.minimum) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <a
                                href="/inventory"
                                className="btn-secondary w-full justify-center inline-flex items-center"
                            >
                                Manage Inventory
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <div className="card-header">
                    <h3 className="text-lg font-medium text-gray-100">Quick Actions</h3>
                    <p className="text-sm text-gray-400">Frequently used operations</p>
                </div>
                <div className="card-content">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <a
                            href="/billing"
                            className="group relative rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <div>
                                <span className="inline-flex rounded-lg p-3 bg-primary-600 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-100">New Sale</h3>
                                <p className="mt-2 text-sm text-gray-400">Process a new billing transaction</p>
                            </div>
                        </a>

                        <a
                            href="/inventory"
                            className="group relative rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <div>
                                <span className="inline-flex rounded-lg p-3 bg-success-600 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-100">Add Stock</h3>
                                <p className="mt-2 text-sm text-gray-400">Update inventory levels</p>
                            </div>
                        </a>

                        <a
                            href="/customers"
                            className="group relative rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <div>
                                <span className="inline-flex rounded-lg p-3 bg-warning-600 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-100">New Customer</h3>
                                <p className="mt-2 text-sm text-gray-400">Register a new customer</p>
                            </div>
                        </a>

                        <a
                            href="/chatbot"
                            className="group relative rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                            <div>
                                <span className="inline-flex rounded-lg p-3 bg-purple-600 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.627 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-100">AI Assistant</h3>
                                <p className="mt-2 text-sm text-gray-400">Get help with queries</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}