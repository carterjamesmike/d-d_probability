import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DamageSimulator from './DamageSimulator';

const HitRateCalculator = () => {
  const [attackCount, setAttackCount] = useState(1);
  const [attackModifier, setAttackModifier] = useState(0);
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState(1);
  const [damageModifier, setDamageModifier] = useState(0);
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);

  const calculateHitRate = (ac) => {
    const hitThreshold = ac - attackModifier;
    let hitChance = Math.min(Math.max((21 - hitThreshold) / 20, 0.05), 0.95);

    if (advantage) {
      hitChance = 1 - (1 - hitChance) ** 2;
    } else if (disadvantage) {
      hitChance = hitChance ** 2;
    }

    return hitChance;
  };

  const calculateCumulativeHitRate = (ac, attacksNeeded) => {
    const hitChance = calculateHitRate(ac);
    let cumulativeProbability = 0;

    for (let i = attacksNeeded; i <= attackCount; i++) {
      cumulativeProbability += binomialProbability(attackCount, i, hitChance);
    }

    return Number((cumulativeProbability * 100).toFixed(2));
  };

  const binomialProbability = (n, k, p) => {
    return combination(n, k) * (p ** k) * ((1 - p) ** (n - k));
  };

  const combination = (n, k) => {
    if (k === 0 || k === n) return 1;
    return factorial(n) / (factorial(k) * factorial(n - k));
  };

  const factorial = (num) => {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
  };

  const generateData = () => {
    return Array.from({ length: 20 }, (_, i) => {
      const ac = i + 6;
      return {
        ac,
        ...Array.from({ length: attackCount }, (_, j) => ({
          [`hitRate${j + 1}`]: calculateCumulativeHitRate(ac, j + 1)
        })).reduce((acc, val) => ({ ...acc, ...val }), {})
      };
    });
  };

  const calculateCritChance = () => {
    if (advantage) {
      return 1 - (19/20) ** 2;
    } else if (disadvantage) {
      return (1/20) ** 2;
    } else {
      return 0.05;
    }
  };

  const toggleAdvantage = () => {
    setAdvantage(!advantage);
    setDisadvantage(false);
  };

  const toggleDisadvantage = () => {
    setDisadvantage(!disadvantage);
    setAdvantage(false);
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">D&D 5e Cumulative Multi-Attack Hit Rate Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="attackCount" className="block">Number of Attacks:</label>
          <input
            type="number"
            id="attackCount"
            value={attackCount}
            onChange={(e) => setAttackCount(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
            min="1"
            max="5"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="attackModifier" className="block">Attack Modifier:</label>
          <input
            type="number"
            id="attackModifier"
            value={attackModifier}
            onChange={(e) => setAttackModifier(parseInt(e.target.value) || 0)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="diceType" className="block">Dice Type:</label>
          <select
            id="diceType"
            value={diceType}
            onChange={(e) => setDiceType(parseInt(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          >
            {[4, 6, 8, 10, 12].map(die => (
              <option key={die} value={die}>d{die}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="diceCount" className="block">Number of Dice:</label>
          <input
            type="number"
            id="diceCount"
            value={diceCount}
            onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="damageModifier" className="block">Damage Modifier:</label>
          <input
            type="number"
            id="damageModifier"
            value={damageModifier}
            onChange={(e) => setDamageModifier(parseInt(e.target.value) || 0)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="col-span-2 flex justify-start space-x-4">
          <button
            onClick={toggleAdvantage}
            className={`px-4 py-2 rounded ${advantage ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Advantage
          </button>
          <button
            onClick={toggleDisadvantage}
            className={`px-4 py-2 rounded ${disadvantage ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Disadvantage
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={generateData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ac" label={{ value: 'Armor Class', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Cumulative Hit Rate (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {Array.from({ length: attackCount }, (_, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={`hitRate${i + 1}`}
              stroke={colors[i]}
              name={`${i + 1}+ Hits`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <DamageSimulator
        diceCount={diceCount}
        diceType={diceType}
        damageModifier={damageModifier}
        critChance={calculateCritChance()}
      />
    </div>
  );
};

export default HitRateCalculator;