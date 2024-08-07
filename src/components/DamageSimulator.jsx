import React, { useState, useEffect } from 'react';

const DamageSimulator = ({ diceCount, diceType, damageModifier }) => {
  const [averageDamage, setAverageDamage] = useState(0);
  const [minDamage, setMinDamage] = useState(0);
  const [maxDamage, setMaxDamage] = useState(0);
  const [minPossible, setMinPossible] = useState(0);
  const [maxPossible, setMaxPossible] = useState(0);


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

    for (let i = 0; i < simulations; i++) {
      const isCritical = Math.random() < 0.05; // 5% chance of critical hit
      const damage = simulateDamage(isCritical);
      totalDamage += damage;
      minDmg = Math.min(minDmg, damage);
      maxDmg = Math.max(maxDmg, damage);
    }

    setAverageDamage(Number((totalDamage / simulations).toFixed(2)));
    setMinDamage(minDmg);
    setMaxDamage(maxDmg);
    setMinPossible(diceCount + damageModifier);
    setMaxPossible((diceCount * 2) * diceType + damageModifier);
  }, [diceCount, diceType, damageModifier]);

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-xl font-bold mb-2">Damage Simulation (100 rolls)</h3>
      <p>Average Damage: {averageDamage}</p>
      <p>Minimum Damage: {minDamage}</p>
      <p>Maximum Damage: {maxDamage}</p>
      <p>Minimum Possible: {minPossible}</p>
      <p>Maximum Possible: {maxPossible}</p>
    </div>
  );
};

export default DamageSimulator;