import React, { useEffect, useState } from 'react'
import './index.css'

function App() {

    const [showSetBalance, setShowSetBalance] = useState(false);
    const [balance, setBalance] = useState(Number(localStorage.getItem('balance')) || 10000);
    const [investment, setInvestment] = useState(Number(localStorage.getItem('investment')) || 1);
    const [loading, showLoading] = useState(false);
    const [tradeResult, setTradeResult] = useState(localStorage.getItem('tradeResult') || 'Place your trade!');
    const [tradeHistory, setTradeHistory] = useState(JSON.parse(localStorage.getItem('tradeHistory')) || []);
    const [showHistory, setShowHistory] = useState(false);
    const [profit, setProfit] = useState(Number(localStorage.getItem('profit')) || 80);

    useEffect(() => localStorage.setItem('balance', balance), [balance]);
    useEffect(() => localStorage.setItem('investment', investment), [investment]);
    useEffect(() => localStorage.setItem('tradeResult', tradeResult), [tradeResult]);
    useEffect(() => localStorage.setItem('tradeHistory', JSON.stringify(tradeHistory)), [tradeHistory]);
    useEffect(() => localStorage.setItem('profit', profit), [profit]);

    const placeTrade = (type) => {
        if (investment > balance) {
            setTradeResult("Insufficient balance.");
            return;
        }

        setBalance(balance - investment);
        showLoading(true);

        setTimeout(() => {
            const result = Math.random() < 0.5 ? "up" : "down";

            if (type === result) {
                setBalance(prev => prev + investment + investment * (profit / 100));
                setTradeResult(`You won! Gained $${investment * (profit / 100)}`);
            } else {
                setTradeResult(`You lost! Lost $${investment}`);
            }

            showLoading(false);

            setTradeHistory(prev => [{
                type,
                investment,
                payout: type === result ? investment * (profit / 100) : -investment,
                dateTime: new Date().toLocaleString()
            }, ...prev]);
        }, 1500);
    };

    return (
        <main>
            <div className="navbar">
                <h1>Binary Trading Simulator</h1>
                <button className="history" onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? "Close" : "History"}
                </button>
            </div>

            <div className="card">
                <p>Practice trading with simulated money</p>

                <div className="balance">
                    <h2>${balance.toFixed(2)}</h2>
                    <button className="edit-balance" onClick={() => setShowSetBalance(true)}>Edit</button>
                </div>

                <div className="input-group">
                    <label>Profit % (You earn ${investment * (profit / 100)})</label>
                    <input type="number" value={profit} onChange={e => setProfit(+e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Investment</label>
                    <div className="invest-row">
                        <input type="number" value={investment} onChange={e => setInvestment(+e.target.value)} />
                        <button className="double-up" onClick={() => setInvestment(investment * 2)}>2x</button>
                    </div>
                </div>

                <div className="trade-buttons">
                    <button className="trade-button call-button" onClick={() => placeTrade("up")}>UP</button>
                    <button className="trade-button put-button" onClick={() => placeTrade("down")}>DOWN</button>
                </div>

                {loading && <div className="loading">Placing trade...</div>}
                {!loading && <div className="trade-result">{tradeResult}</div>}
            </div>

            {showSetBalance && (
                <div className="set-balance-modal">
                    <div className="set-balance-content">
                        <input type="number" value={balance} onChange={e => setBalance(+e.target.value)} />
                        <button className='save-button' onClick={() => setShowSetBalance(false)}>Save</button>
                    </div>
                </div>
            )}

            {showHistory && (
                <div className="trade-history">
                    <h3>Trade History</h3>
                    {tradeHistory.length === 0 && <p>No trades yet</p>}
                    {tradeHistory.map((t, i) => (
                        <div key={i} className="trade-item">
                            <div>
                                <span>{t.type === 'up' ? 'BUY' : 'SELL'}</span>
                                <span style={{ color: t.payout > 0 ? 'green' : 'red' }}>
                                    ${Math.abs(t.payout)}
                                </span>
                            </div>
                            <span>{t.dateTime}</span>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default App;
