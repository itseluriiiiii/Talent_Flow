// Simple API test script
const BASE_URL = 'http://localhost:3001/api';

async function testLogin() {
  console.log('Testing login...');
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'sarah.johnson@company.com',
        password: 'demo123',
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Login failed:', data);
      return null;
    }

    console.log('✅ Login successful');
    console.log('Token:', data.token.substring(0, 20) + '...');
    console.log('User:', data.user.name, `(${data.user.email})`);
    return data.token;
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function testGetCandidates(token) {
  console.log('\nTesting get candidates...');
  try {
    const response = await fetch(`${BASE_URL}/candidates`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Get candidates failed:', data);
      return;
    }

    console.log('✅ Get candidates successful');
    console.log(`Found ${data.length} candidates`);
    if (data.length > 0) {
      console.log('First candidate:', data[0].name);
    }
  } catch (error) {
    console.error('❌ Get candidates error:', error.message);
  }
}

async function testHealth() {
  console.log('Testing health endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check:', data.message);
  } catch (error) {
    console.error('❌ Health check error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealth();
  const token = await testLogin();
  
  if (token) {
    await testGetCandidates(token);
  }
  
  console.log('\n✨ Tests complete');
}

runTests();
