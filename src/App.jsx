import React, { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [showSetBalance, setShowSetBalance] = useState(false);
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance');
    return saved ? Number(saved) : 10000;
  });
  const [investment, setInvestment] = useState(() => {
    const saved = localStorage.getItem('investment');
    return saved ? Number(saved) : 1;
  });
  const [loading, showLoading] = useState(false);
  const [tradeResult, setTradeResult] = useState(() => {
    return localStorage.getItem('tradeResult') || 'Place your trade!';
  });
  const [tradeHistory, setTradeHistory] = useState(() => {
    const saved = localStorage.getItem('tradeHistory');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error parsing trade history:", error);
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [profit, setProfit] = useState(() => {
    const saved = localStorage.getItem('profit');
    return saved ? Number(saved) : 80;
  });

  useEffect(() => {
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('investment', investment.toString());
  }, [investment]);

  useEffect(() => {
    localStorage.setItem('tradeResult', tradeResult);
  }, [tradeResult]);

  useEffect(() => {
    localStorage.setItem('tradeHistory', JSON.stringify(tradeHistory));
  }, [tradeHistory]);

  useEffect(() => {
    localStorage.setItem('profit', profit.toString());
  }, [profit]);

  const placeTrade = (type) => {
    if (investment > balance) {
      setTradeResult("Insufficient balance for this investment.");
      return;
    }
    setBalance(balance - investment);
    showLoading(true);
    calculateTradeOutcome(type, investment, balance);
  };

  const calculateTradeOutcome = (type, investmentAmount, currentBalance) => {
    setTimeout(() => {
      const result = Math.random() < 0.5 ? "up" : "down";
      if (type === result) {
        setBalance(currentBalance + investmentAmount*(profit/100));
        setTradeResult(`You won! The market went ${result}. You gained $${investmentAmount*(profit/100)}.`);
      } else {
        setTradeResult(`You lost! The market went ${result}. You lost $${investmentAmount}.`);
      }
      showLoading(false);
      setTradeHistory(prev => [{
        type,
        investment: investmentAmount,
        result: type === result ? "won" : "lost",
        payout: type === result ? investmentAmount*(profit/100) : -investmentAmount,
        dateTime: new Date().toLocaleString()
      }, ...prev]);
    }, 3000);
  }

  const renderTradeHistory = () => {
    return (
      <div className="history-container">
        <h3>Trade History</h3>
        {tradeHistory.length > 0 ? tradeHistory.map((trade, index) => (
          <div key={index} className="history-item">
            <div>{trade.type == 'up' ? 'Buy' : 'Sell'}</div>
            <div style={{color: trade.payout > 0 ? 'green' : 'red'}}>
              ${trade.payout > 0 ? trade.payout : -trade.payout}
            </div>
            <div>{trade.dateTime || 'XX-XX-XXXX XX:XX:XX'}</div>
          </div>
        )) : <div>No trades made yet.</div>}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Binary Trading Simulation</h1>
      <button onClick={() => setShowHistory(!showHistory)}>
        {!showHistory ? 'Trade History' : 'Close'}
      </button>

      <div className="welcome-section">
        <h2>Welcome to the Binary Trading Simulation App!</h2>
        <p>Account Balance: ${balance.toFixed(2)}</p>
        <button onClick={() => setShowSetBalance(!showSetBalance)}>Edit</button>
        <p>Profit: ${investment*(profit/100)}</p>
        <input
          type="range"
          min="1"
          max="100"
          value={profit}
          onChange={(e) => setProfit(Number(e.target.value))}
        />
        {showSetBalance && (
          <div>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
            <button onClick={() => setShowSetBalance(false)}>Save</button>
          </div>
        )}
      </div>

      {loading && <div className="loading">Placing trade...</div>}
      
      {tradeResult && !loading && (
        <div className="trade-result">
          {tradeResult}
        </div>
      )}

      <div className="investment-section">
        <p>Investment: ${investment}</p>
        <input
          type="range"
          min="1"
          max={balance}
          value={investment}
          onChange={(e) => setInvestment(Number(e.target.value))}
        />
        <button onClick={() => setInvestment(investment*2)}>2x</button>
      </div>

      <div className="trade-buttons">
        <button onClick={() => placeTrade("up")}>Up</button>
        <button onClick={() => placeTrade("down")}>Down</button>
      </div>

      {showHistory && renderTradeHistory()}
    </div>
  )
}

export default App