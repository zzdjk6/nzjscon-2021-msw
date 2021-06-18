// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { mockServer } from "./mock-server/mockServer.node";
import { resetMockDB } from "./mock-server/mockDB";

// Establish API mocking before all tests.
beforeAll(() => mockServer.listen());

// Clean up after the tests are finished.
afterAll(() => mockServer.close());

// Reset any request handlers that we add via server.use(),
//   so they don't affect other tests.
afterEach(() => mockServer.resetHandlers());

// Reset mock data storage after each tests
afterEach(() => resetMockDB());
