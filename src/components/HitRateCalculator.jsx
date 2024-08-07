import React, { useState } from "react";
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
import DamageSimulator from "./DamageSimulator";

const HitRateCalculator = () => {
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

    return Number((hitChance * 100).toFixed(2));
  };

  const data = Array.from({ length: 20 }, (_, i) => ({
    ac: i + 6,
    hitRate: calculateHitRate(i + 6),
  }));

  const toggleAdvantage = () => {
    setAdvantage(!advantage);
    setDisadvantage(false);
  };

  const toggleDisadvantage = () => {
    setDisadvantage(!disadvantage);
    setAdvantage(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">D&D 5e Hit Rate Calculator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="attackModifier" className="block">
            Attack Modifier:
          </label>
          <input
            type="number"
            id="attackModifier"
            value={attackModifier}
            onChange={(e) => setAttackModifier(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="diceType" className="block">
            Dice Type:
          </label>
          <select
            id="diceType"
            value={diceType}
            onChange={(e) => setDiceType(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          >
            {[4, 6, 8, 10, 12].map((die) => (
              <option key={die} value={die}>
                d{die}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="diceCount" className="block">
            Number of Dice:
          </label>
          <input
            type="number"
            id="diceCount"
            value={diceCount}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="damageModifier" className="block">
            Damage Modifier:
          </label>
          <input
            type="number"
            id="damageModifier"
            value={damageModifier}
            onChange={(e) => setDamageModifier(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>
      <div className="flex">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ac"
              label={{
                value: "Armor Class",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Hit Rate (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="hitRate"
              stroke="#8884d8"
              name="Hit Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between">
        <div className="mt-4">
          <label className="block">Roll with Advantage</label>
          <input
            type="checkbox"
            checked={advantage}
            onChange={(e) => toggleAdvantage(e.target.checked)}
          />
        </div>

        <div className="mt-4">
          <label className="block">Roll with Disadvantage</label>
          <input
            type="checkbox"
            checked={disadvantage}
            onChange={(e) => toggleDisadvantage(e.target.checked)}
          />
        </div>
      </div>

      <DamageSimulator
        diceCount={diceCount}
        diceType={diceType}
        damageModifier={damageModifier}
      />
    </div>
  );
};

export default HitRateCalculator;
