const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'src/pages/admin/components',
  'src/pages/admin/services',
  'src/pages/admin/hooks',
  'src/pages/admin/users',
  'src/pages/admin/content'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Move files to new locations
const moveFiles = [
  // Components
  { 
    from: 'src/components/dashboard/StatsCard.jsx', 
    to: 'src/pages/admin/components/StatsCard.jsx' 
  },
  { 
    from: 'src/components/ui/Button.jsx', 
    to: 'src/pages/admin/components/Button.jsx' 
  },
  { 
    from: 'src/components/ui/Card.jsx', 
    to: 'src/pages/admin/components/Card.jsx' 
  },
  
  // Services
  { 
    from: 'src/api/content.js', 
    to: 'src/pages/admin/services/content.js' 
  },
  { 
    from: 'src/api/roles.js', 
    to: 'src/pages/admin/services/roles.js' 
  },
  { 
    from: 'src/api/users.js', 
    to: 'src/pages/admin/services/userService.js' 
  },
  
  // Hooks
  { 
    from: 'src/hooks/useAuth.js', 
    to: 'src/pages/admin/hooks/useAuth.js' 
  },
  { 
    from: 'src/hooks/useTheme.js', 
    to: 'src/pages/admin/hooks/useTheme.js' 
  },
  
  // Users
  { 
    from: 'src/components/forms/UserForm.jsx', 
    to: 'src/pages/admin/users/UserForm.jsx' 
  },
  { 
    from: 'src/components/tables/UsersList.jsx', 
    to: 'src/pages/admin/users/Users.jsx' 
  },
  { 
    from: 'src/components/tables/Pagination.jsx', 
    to: 'src/pages/admin/users/Pagination.jsx' 
  },
  { 
    from: 'src/components/forms/FormField.jsx', 
    to: 'src/pages/admin/users/FormField.jsx' 
  },
  
  // Content
  { 
    from: 'src/pages/dashboard/admin/content/ContentPage.jsx', 
    to: 'src/pages/admin/content/Content.jsx' 
  }
];

// Move files and create empty ones if they don't exist
moveFiles.forEach(({ from, to }) => {
  try {
    if (fs.existsSync(from)) {
      fs.renameSync(from, to);
      console.log(`Moved ${from} to ${to}`);
    } else {
      fs.writeFileSync(to, '');
      console.log(`Created empty file: ${to}`);
    }
  } catch (error) {
    console.error(`Error processing ${from} -> ${to}:`, error.message);
  }
});

console.log('Reorganization complete!');
