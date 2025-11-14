import supervisorService from './supervisorService';
import supervisorApiService from './supervisorApiService';

// Test function to verify supervisor services
export const testSupervisorServices = async () => {
  try {
    console.log('Testing Supervisor Services...');
    
    // Test dashboard stats
    console.log('1. Testing dashboard stats...');
    const dashboardStats = await supervisorService.getDashboardStats();
    console.log('Dashboard Stats:', dashboardStats);
    
    // Test profile
    console.log('2. Testing profile...');
    const profile = await supervisorService.getProfile();
    console.log('Profile:', profile);
    
    // Test schools
    console.log('3. Testing schools...');
    const schools = await supervisorService.getSchools();
    console.log('Schools:', schools);
    
    // Test reports
    console.log('4. Testing reports...');
    const reports = await supervisorService.getReports();
    console.log('Reports:', reports);
    
    // Test invitations
    console.log('5. Testing invitations...');
    const invitations = await supervisorService.getInvitations();
    console.log('Invitations:', invitations);
    
    // Test principals
    console.log('6. Testing principals...');
    const pendingPrincipals = await supervisorService.getPendingPrincipals();
    console.log('Pending Principals:', pendingPrincipals);
    
    // Test notifications
    console.log('7. Testing notifications...');
    const notifications = await supervisorService.getNotifications();
    console.log('Notifications:', notifications);
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Error testing supervisor services:', error);
  }
};

// Test function to verify supervisor API services
export const testSupervisorApiServices = async () => {
  try {
    console.log('Testing Supervisor API Services...');
    
    // Test dashboard stats
    console.log('1. Testing dashboard stats...');
    const dashboardStats = await supervisorApiService.getDashboardStats();
    console.log('Dashboard Stats:', dashboardStats);
    
    // Test profile
    console.log('2. Testing profile...');
    const profile = await supervisorApiService.getProfile();
    console.log('Profile:', profile);
    
    // Test schools
    console.log('3. Testing schools...');
    const schools = await supervisorApiService.getSchools();
    console.log('Schools:', schools);
    
    // Test reports
    console.log('4. Testing reports...');
    const reports = await supervisorApiService.getReports();
    console.log('Reports:', reports);
    
    // Test invitations
    console.log('5. Testing invitations...');
    const invitations = await supervisorApiService.getInvitations();
    console.log('Invitations:', invitations);
    
    // Test principals
    console.log('6. Testing principals...');
    const pendingPrincipals = await supervisorApiService.getPendingPrincipals();
    console.log('Pending Principals:', pendingPrincipals);
    
    // Test notifications
    console.log('7. Testing notifications...');
    const notifications = await supervisorApiService.getNotifications();
    console.log('Notifications:', notifications);
    
    console.log('All API tests completed successfully!');
    
  } catch (error) {
    console.error('Error testing supervisor API services:', error);
  }
};

export default {
  testSupervisorServices,
  testSupervisorApiServices
};