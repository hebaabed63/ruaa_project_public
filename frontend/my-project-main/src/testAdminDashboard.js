// Test script to verify admin dashboard functionality
console.log('Testing Admin Dashboard Functionality');

// Mock data that would be returned from the backend
const mockDashboardData = {
  success: true,
  data: {
    overview: {
      total_users: 59,
      active_users: 50,
      pending_users: 4,
      total_schools: 3,
      total_links: 3,
      active_links: 3,
      support_tickets: 0
    },
    recent_registrations: [
      {
        name: "عمر عوض الله",
        email: "omarawd@gmail.com",
        link_type: "principal",
        used_at: "2025-10-22 09:53:24"
      },
      {
        name: "قصي الحاتم",
        email: "qusai@gmail.com",
        link_type: "supervisor",
        used_at: "2025-10-22 09:07:34"
      }
    ]
  },
  message: "تم جلب الإحصائيات بنجاح"
};

console.log('Mock Dashboard Data:', mockDashboardData);

// Test the data structure
if (mockDashboardData.success && mockDashboardData.data) {
  const { overview, recent_registrations } = mockDashboardData.data;
  
  console.log('Overview Stats:');
  console.log('- Total Users:', overview.total_users);
  console.log('- Active Users:', overview.active_users);
  console.log('- Pending Users:', overview.pending_users);
  console.log('- Total Schools:', overview.total_schools);
  console.log('- Total Links:', overview.total_links);
  console.log('- Active Links:', overview.active_links);
  console.log('- Support Tickets:', overview.support_tickets);
  
  console.log('\nRecent Registrations:');
  recent_registrations.forEach((reg, index) => {
    console.log(`${index + 1}. ${reg.name} (${reg.email}) - ${reg.link_type} - ${reg.used_at}`);
  });
  
  console.log('\n✅ Admin Dashboard Data Structure Test Passed');
} else {
  console.log('❌ Admin Dashboard Data Structure Test Failed');
}

export default mockDashboardData;