import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnimateObjectsCalculator = () => {
  const [count, setCount] = useState(10);
  const [selectedObjects, setSelectedObjects] = useState({tiny: 0, small: 0, medium: 0, large: 0, huge: 0});

  const tiny = {
    HP: 20,
    AC: 18,
    Str: 4,
    Dex: 18,
    Attack: 8,
    DiceCount: 1,
    DiceType: 4,
    DamageMod: 4,
    cost: 1,
  };

  const small = {
    HP: 25,
    AC: 16,
    Str: 6,
    Dex: 14,
    Attack: 6,
    DiceCount: 1,
    DiceType: 8,
    DamageMod: 2,
    cost: 1,
  };

  const medium = {
    HP: 40,
    AC: 13,
    Str: 10,
    Dex: 12,
    Attack: 5,
    DiceCount: 2,
    DiceType: 6,
    DamageMod: 1,
    cost: 2,
  };

  const large = {
    HP: 50,
    AC: 10,
    Str: 14,
    Dex: 10,
    Attack: 6,
    DiceCount: 2,
    DiceType: 10,
    DamageMod: 2,
    cost: 4,
  };

  const huge = {
    HP: 80,
    AC: 10,
    Str: 18,
    Dex: 6,
    Attack: 8,
    DiceCount: 2,
    DiceType: 12,
    DamageMod: 4,
    cost: 8,
  };

  const objectTypes = { tiny, small, medium, large, huge };

  const handleObjectChange = (type, value) => {
    const newCount = count + selectedObjects[type] * objectTypes[type].cost - value * objectTypes[type].cost;
    if (newCount >= 0 && newCount <= 10) {
      setSelectedObjects({...selectedObjects, [type]: value});
      setCount(newCount);
    }
  };

  const calculateHitRate = (ac, attackBonus) => {
    const hitChance = Math.min(Math.max((21 + attackBonus - ac) / 20, 0.05), 0.95);
    return hitChance;
  };

  const calculateAverageDamage = (diceCount, diceType, damageMod) => {
    return diceCount * ((diceType + 1) / 2) + damageMod;
  };

  const generateData = () => {
    return Array.from({ length: 20 }, (_, i) => {
      const ac = i + 6;
      const data = { ac };
      Object.entries(selectedObjects).forEach(([type, count]) => {
        if (count > 0) {
          const object = objectTypes[type];
          const hitRate = calculateHitRate(ac, object.Attack);
          const avgDamage = calculateAverageDamage(object.DiceCount, object.DiceType, object.DamageMod);
          data[`${type}HitRate`] = Number((hitRate * 100).toFixed(2));
          data[`${type}ExpectedDamage`] = Number((hitRate * avgDamage * count).toFixed(2));
        }
      });
      data.totalExpectedDamage = Object.entries(selectedObjects).reduce((total, [type, count]) => {
        if (count > 0) {
          const object = objectTypes[type];
          const hitRate = calculateHitRate(ac, object.Attack);
          const avgDamage = calculateAverageDamage(object.DiceCount, object.DiceType, object.DamageMod);
          return total + hitRate * avgDamage * count;
        }
        return total;
      }, 0);
      return data;
    });
  };

  const colors = {
    tiny: '#8884d8',
    small: '#82ca9d',
    medium: '#ffc658',
    large: '#ff7300',
    huge: '#0088fe',
  };

  return (
    <div className="p-4">
      <h3>
        <a href="/">Home</a>
      </h3>
      <h2 className="text-2xl font-bold mb-4">D&D 5e Animate Objects Calculator</h2>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {Object.entries(objectTypes).map(([type, object]) => (
          <div key={type} className="border p-2 rounded">
            <h3 className="font-bold capitalize">{type}</h3>
            <p>Attack: +{object.Attack}</p>
            <p>Damage: {object.DiceCount}d{object.DiceType}+{object.DamageMod}</p>
            <input
              type="number"
              value={selectedObjects[type]}
              onChange={(e) => handleObjectChange(type, parseInt(e.target.value) || 0)}
              min="0"
              max={Math.floor(10 / object.cost)}
              className="w-full mt-2 border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>
      <p className="mb-4">Remaining points: {count}/10</p>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={generateData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ac" label={{ value: 'Armor Class', position: 'insideBottom', offset: -5 }} />
          <YAxis yAxisId="left" label={{ value: 'Hit Rate (%)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Expected Damage', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          {Object.entries(selectedObjects).map(([type, count]) => count > 0 && (
            <Line key={`${type}HitRate`} yAxisId="left" type="monotone" dataKey={`${type}HitRate`} stroke={colors[type]} name={`${type.charAt(0).toUpperCase() + type.slice(1)} Hit Rate`} />
          ))}
          {Object.entries(selectedObjects).map(([type, count]) => count > 0 && (
            <Line key={`${type}ExpectedDamage`} yAxisId="right" type="monotone" dataKey={`${type}ExpectedDamage`} stroke={colors[type]} name={`${type.charAt(0).toUpperCase() + type.slice(1)} Damage`} strokeDasharray="5 5" />
          ))}
          <Line yAxisId="right" type="monotone" dataKey="totalExpectedDamage" stroke="#ff0000" name="Total Expected Damage" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimateObjectsCalculator;