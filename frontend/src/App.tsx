import React from 'react';
import './App.css';

interface Data {
  shouldBuy: boolean,
  buyTime: number,
  buyPrice: number,
  sellTime: number,
  sellPrice: number,
}
interface Error {
  message: string[],
}

function App() {
  const submit = async () => {
    setData(null);

    if (!validate()) {
      return;
    }

    const response = await fetch(`/api/max-profit?startTime=${startTime}&endTime=${endTime}`);

    if (response.ok) {
      const response_body = await response.json();
      setData(response_body);
      setError(null);

      if (response_body.shouldBuy) {
        const shares = Math.floor(parseInt(funds) / response_body.buyPrice);
        const profit = response_body.sellPrice * shares - parseInt(funds);
        setProfit(profit);
        setShares(shares);
      }
    } else if(response.status === 400) {
      const response_body = await response.json();

      setError(response_body);
    } else {
      setError({message: ['Something went wrong with the server. Please try again later or contact support.']})
    }
  };

  const validate = () => {
    if (isNaN(parseInt(funds)) || parseInt(funds) <= 0) {
      setError({message: ['funds should be a number greater than 0']})
      return false;
    }

    return true;
  };

  const [funds, setFunds] = React.useState('');
  const [startTime, setStartTime] = React.useState('1672531200');
  const [endTime, setEndTime] = React.useState('1672531260');
  const [data, setData] = React.useState<Data | null>(null);
  const [profit, setProfit] = React.useState(0);
  const [shares, setShares] = React.useState(0);
  const [error, setError] = React.useState<Error | null>(null);

  return (
    <div className="App container">
      <h1 className="text-align-center">Basic profit calculator</h1>
      <div className="row mb-3">
        <p className="col-auto">
          Enter the time period and the available funds you want to invest and the calculator will give you the most profitable
          time to buy and sell.
        </p>
        <p>
          <small>NOTE: We support only UNIX timestamps for the time fields.</small>
        </p>
        <details>
          <summary><small>Click for hints about the current data</small></summary>
          <ul>
            <li>Submit default values will return 12$ for buy and 97$ for sell.</li>
            <li>Start time of 1672531210 will return 10$ for buy and 95$ for sell</li>
            <li>Start time of 1672531258 will return no profitable situation.</li>
          </ul>
        </details>
      </div>
      {error && (
        <div className="row">
          <div className='col-auto'>
            <ul className=" text-danger">
            {error.message.map((message, index) => (
              <li key={index}>
                {message}
              </li>
            ))}
            </ul>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-auto">
          <label className="form-label" htmlFor="funds">Available funds ($):</label>
          <input className="form-control" id="funds" value={funds} onChange={e => setFunds(e.target.value)} />
        </div>

        <div className="col-auto">
          <label className="form-label" htmlFor="startTime">Start date:</label>
          <input className="form-control" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div className="col-auto">
          <label className="form-label" htmlFor="endTime">End date:</label>
          <input className="form-control" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>
        <div className="col-auto position-relative">
          <button className="btn btn-primary position-absolute bottom-0" onClick={submit}>Submit</button>
        </div>
      </div>
      {data && (
        <div className="row mt-3">
          {data.shouldBuy ? (
            <div className="col-auto">
              <p>
                Buy {shares} shares at {data.buyTime} for {data.buyPrice}$ and sell at {data.sellTime} for {data.sellPrice}$.
                For a net profit of {profit}$.
              </p>
            </div>
          ) : (
            <div>There is no profitable opportunity in the specified time period.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
