import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DamageSimulator = ({ diceCount, diceType, damageModifier }) => {
  const [averageDamage, setAverageDamage] = useState(0);
  const [minDamage, setMinDamage] = useState(0);
  const [maxDamage, setMaxDamage] = useState(0);
  const [minPossible, setMinPossible] = useState(0);
  const [maxPossible, setMaxPossible] = useState(0);
  const [damageData, setDamageData] = useState([]);

  const simulateRoll = () => {
    return Math.floor(Math.random() * diceType) + 1;
  };

  const simulateDamage = (isCritical = false) => {
    const diceRolls = Array(isCritical ? diceCount * 2 : diceCount)
      .fill(0)
      .map(() => simulateRoll());
    return diceRolls.reduce((sum, roll) => sum + roll, 0) + damageModifier;
  };

  useEffect(() => {
    const simulations = 100;
    let totalDamage = 0;
    let minDmg = Infinity;
    let maxDmg = -Infinity;
    const damageFrequency = {};

    for (let i = 0; i < simulations; i++) {
      const isCritical = Math.random() < 0.05; // 5% chance of critical hit
      const damage = simulateDamage(isCritical);
      totalDamage += damage;
      minDmg = Math.min(minDmg, damage);
      maxDmg = Math.max(maxDmg, damage);
      damageFrequency[damage] = (damageFrequency[damage] || 0) + 1;
    }

    setAverageDamage(Number((totalDamage / simulations).toFixed(2)));
    setMinDamage(minDmg);
    setMaxDamage(maxDmg);
    setMinPossible(diceCount + damageModifier);
    setMaxPossible(diceCount * 2 * diceType + damageModifier);

    const newDamageData = Object.entries(damageFrequency).map(([damage, frequency]) => ({
      damage: Number(damage),
      frequency,
    }));
    newDamageData.sort((a, b) => a.damage - b.damage);
    setDamageData(newDamageData);
  }, [diceCount, diceType, damageModifier]);

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-xl font-bold mb-2">Damage Simulation (100 rolls)</h3>
      <p>Average Rolled: {averageDamage}</p>
      <p>Minimum Rolled: {minDamage}</p>
      <p>Maximum Rolled: {maxDamage}</p>
      <p>Minimum Possible: {minPossible}</p>
      <p>Maximum Possible: {maxPossible}</p>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart
            data={damageData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="damage" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="frequency" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DamageSimulator;