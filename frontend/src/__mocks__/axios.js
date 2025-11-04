// Manual mock for axios to avoid ESM import issues in Jest (CRA)
const axiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

module.exports = axiosMock;

