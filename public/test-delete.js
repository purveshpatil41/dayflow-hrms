// Test the delete account functionality
// Open browser console and run this to test if the API is working

async function testDeleteAccount() {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    
    if (!token) {
      console.error('No token found. Please login first.');
      return;
    }

    const response = await fetch('http://localhost:5000/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (data.success) {
      console.log('✅ Delete account API is working!');
    } else {
      console.log('❌ Delete account failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error testing delete account:', error);
  }
}

console.log('Run testDeleteAccount() in console to test the API');