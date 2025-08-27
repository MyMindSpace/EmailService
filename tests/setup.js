// Jest setup file
jest.setTimeout(10000);

// Suppress console logs during testing unless needed
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
}
