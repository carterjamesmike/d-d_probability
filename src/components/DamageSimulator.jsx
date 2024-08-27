import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DamageSimulator = ({ attacks }) => {
  const [damageData, setDamageData] = useState([]);
  const [maxFrequencies, setMaxFrequencies] = useState([]);

  const simulateRoll = (diceType) => {
    return Math.floor(Math.random() * diceType) + 1;
  };

  const simulateDamage = (attack, isCritical = false) => {
    let totalDamage = 0;
    attack.damages.forEach(damage => {
      const diceCount = isCritical ? damage.diceCount * 2 : damage.diceCount;
      const diceRolls = Array(diceCount).fill(0).map(() => simulateRoll(damage.diceType));
      totalDamage += diceRolls.reduce((sum, roll) => sum + roll, 0) + damage.modifier;
    });
    return totalDamage;
  };

  useEffect(() => {
    const simulations = 100;
    const damageFrequencies = attacks.map(() => ({}));

    for (let i = 0; i < simulations; i++) {
      attacks.forEach((attack, index) => {
        const isCritical = Math.random() < 0.05; // 5% chance of critical hit
        const damage = simulateDamage(attack, isCritical);
        damageFrequencies[index][damage] = (damageFrequencies[index][damage] || 0) + 1;
      });
    }

    // Combine all damage values that were rolled
    const allDamageValues = new Set();
    damageFrequencies.forEach(freq => {
      Object.keys(freq).forEach(damage => allDamageValues.add(Number(damage)));
    });

    // Create data only for damage values that were rolled
    const newDamageData = Array.from(allDamageValues).sort((a, b) => a - b).map(damage => ({
      damage,
      ...attacks.reduce((acc, _, index) => ({
        ...acc,
        [`frequency${index + 1}`]: damageFrequencies[index][damage] || 0
      }), {})
    }));

    setDamageData(newDamageData);

    const maxFreqs = attacks.map((_, index) =>
      Math.max(...newDamageData.map(d => d[`frequency${index + 1}`]))
  );
    setMaxFrequencies(maxFreqs);
  },
  [attacks]);

  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe",
    "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57"
  ];

  const renderDot = (attackIndex) => (props) => {
    const { cx, cy, value } = props;
    if (value === maxFrequencies[attackIndex]) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill={colors[attackIndex % colors.length]} 
          stroke="white"
        />
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Damage Simulation (100 rolls)</h3>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={damageData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="damage" 
              label={{ value: "Total Damage", position: "insideBottomRight", offset: -10 }}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            {attacks.map((attack, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={`frequency${index + 1}`}
                stroke={colors[index % colors.length]}
                name={attack.name || `Attack ${index + 1}`}
                dot={renderDot(index)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DamageSimulator;