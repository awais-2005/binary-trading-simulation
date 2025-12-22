import React, { useEffect, useState } from 'react'
import './index.css'

function App() {

    const [showSetBalance, setShowSetBalance] = useState(false);
    const [balance, setBalance] = useState(10000);
    const [investment, setInvestment] = useState(1);
    const [loading, showLoading] = useState(false);
    const [tradeResult, setTradeResult] = useState('Place your trade!');
    const [tradeHistory, setTradeHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [profit, setProfit] = useState(80);

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

    useEffect(() => {
        const savedBalance = localStorage.getItem('balance') || '10000';
        try {
            setBalance(Number(savedBalance));
        } catch (error) {
            console.error("Error parsing saved balance:", error);
            setBalance(10000);
        }

        const savedInvestment = localStorage.getItem('investment') || '1';
        try {
            setInvestment(Number(savedInvestment));
        } catch (error) {
            console.error("Error parsing saved investment:", error);
            setInvestment(1);
        }

        const savedProfit = localStorage.getItem('profit') || '80';
        try {
            setProfit(Number(savedProfit));
        } catch (error) {
            console.error("Error parsing saved profit:", error);
            setProfit(80);
        }

        const tradeHistory = localStorage.getItem('tradeHistory') || '[]';
        try {
            const parsedHistory = JSON.parse(tradeHistory);
            setTradeHistory(parsedHistory);
            console.log("Trade History:", parsedHistory);
        } catch (error) {
            console.error("Error parsing trade history:", error);
            setTradeHistory([]);
        }

        const lastTradeResult = localStorage.getItem('tradeResult') || 'Place your trade!';
        setTradeResult(lastTradeResult);
    }, []);

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
            <div className='trade-history'>
                <h2>Trade History</h2>
                {tradeHistory.length > 0 ? tradeHistory.map((trade, index) => (
                    <div key={index} className='trade-item'>
                        <div>
                            <span className='trade-type'>{trade.type == 'up' ? 'Buy' : 'Sell'}</span>
                            <span className='payout' style={{color: trade.payout > 0 ? 'green' : 'red'}} >${trade.payout > 0 ? trade.payout : -trade.payout}</span>
                        </div>
                        <span className='date-time'>{trade.dateTime || 'XX-XX-XXXX XX:XX:XX'}</span>
                    </div>
                )) : <p className='no-trades'>No trades made yet.</p>}
            </div>
        );
    };

  return (
    <main>
        <div className="navbar">
            <h1>Binary Trading Simulation</h1>
            <button className='history' onClick={() => setShowHistory(!showHistory)}>{!showHistory ? 'Trade History' : 'Close'}</button>
        </div>
        <p>Welcome to the Binary Trading Simulation App!</p>
        <div className='balance'>
            <h2>Account Balance: ${balance.toFixed(2)}</h2>
            <button className='edit-balance' onClick={() => {setShowSetBalance(!showSetBalance)}}>Edit</button>
        </div>

        <span className='profit-label'>Profit: ${investment*(profit/100)}</span>        
        <input className="profit"
            type="number"
            min={1}
            max={100}
            placeholder="Profit Percentage"
            value={profit}
            onChange={(e) => setProfit(Number(e.target.value))}
        />

        {showSetBalance && (
            <div className='set-balance-content'>
                <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                />
                <button onClick={() => setShowSetBalance(false)}>Save</button>
            </div>
        )}

        {loading && <div className='loading'>Placing trade...</div>}
        {tradeResult && !loading && <div className='trade-result'>{tradeResult}</div>}

        <span className='investment-label'>Investment: ${investment}</span>
        
        <div className="invest-container">
            <input className="investment"
                type="number"
                min={1}
                placeholder="Investment Amount"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
            />
            <button className='double-up' onClick={() => setInvestment(investment*2)} >2x</button>
        </div>

        <div className="trade-buttons-container">
            <button className='trade-button call-button' onClick={() => placeTrade("up")} >Up</button>
            <button className='trade-button put-button' onClick={() => placeTrade("down")} >Down</button>
        </div>

        {showHistory && renderTradeHistory()}

    </main>
  )
}

export default App