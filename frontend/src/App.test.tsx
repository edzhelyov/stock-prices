import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the initial page', () => {
  render(<App />);

  const title = screen.getByText(/Basic profit calculator/i);
  expect(title).toBeInTheDocument();

  const funds = screen.getByLabelText(/Funds/i);
  expect(funds).toBeInTheDocument();
  expect(funds).toHaveValue('');

  const startTimeInput = screen.getByLabelText(/Start date:/i);
  expect(startTimeInput).toBeInTheDocument();
  expect(startTimeInput).toHaveValue('1672531200');

  const endTimeInput = screen.getByLabelText(/End date:/i);
  expect(endTimeInput).toBeInTheDocument();
  expect(endTimeInput).toHaveValue('1672531260');
});

test('validates funds', () => {
  render(<App />);

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  expect(submitButton).toBeInTheDocument();

  const funds = screen.getByLabelText(/Funds/i);
  expect(funds).toHaveValue('');

  fireEvent.click(submitButton);
  hasError('funds should be a number greater than 0');

  fireEvent.change(funds, { target: { value: '-1' } });
  fireEvent.click(submitButton);
  hasError('funds should be a number greater than 0');

  fireEvent.change(funds, { target: { value: 'a1' } });
  fireEvent.click(submitButton);
  hasError('funds should be a number greater than 0');
});

test('calculates and display profit information', async () => {
  mockResponse(200, {
    shouldBuy: true,
    buyTime: 1672531226,
    buyPrice: 10,
    sellTime: 1672531255,
    sellPrice: 95
  });
  
  render(<App />);

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  const funds = screen.getByLabelText(/Funds/i);
  fireEvent.change(funds, { target: { value: '1000' } });

  fireEvent.click(submitButton);

  await waitFor(() => {
    const element = screen.getByTestId('profit');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Buy 100 shares at 1672531226 for 10$ and sell at 1672531255 for 95$. For a net profit of 8500$');
  });
});

test('renders validation errors from the server', async () => {
  mockResponse(400, {
    "message": ["endTime should not be greater than 1672531260"],
    "error":"Bad Request",
    "statusCode":400
  });

  render(<App />);

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  const funds = screen.getByLabelText(/Funds/i);
  fireEvent.change(funds, { target: { value: '1000' } });

  fireEvent.click(submitButton);

  await waitFor(() => {
    hasError('endTime should not be greater than 1672531260');
  });
});

test('renders user friendly message when the server has problems', async () => {
  mockResponse(500, 'Internal Server Error');

  render(<App />);

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  const funds = screen.getByLabelText(/Funds/i);
  fireEvent.change(funds, { target: { value: '1000' } });

  fireEvent.click(submitButton);

  await waitFor(() => {
    hasError('Something went wrong with the server. Please try again later or contact support.');
  });
});

const hasError = (message: string) => {
  const errorElement = document.querySelector('.text-danger > li');
  expect(errorElement).toHaveTextContent(message);
}

const mockResponse = (status: number, body: any) => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: status,
    headers: {
      'Content-type': 'application/json',
    },
  });
  const mockFetchPromise = Promise.resolve(mockResponse);
  jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
}