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
  const [attacks, setAttacks] = useState([]);
  const [expandedAttacks, setExpandedAttacks] = useState([]);
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);

  const toggleAdvantage = () => {
    setAdvantage(!advantage);
    setDisadvantage(false);
  };

  const toggleDisadvantage = () => {
    setDisadvantage(!disadvantage);
    setAdvantage(false);
  };

  const addAttack = () => {
    const newAttack = {
      name: "",
      attackModifier: 0,
      advantage: false,
      disadvantage: false,
      damages: [
        {
          name: "",
          diceCount: 1,
          diceType: 6,
          modifier: 0,
          type: "",
        },
      ],
    };
    setAttacks([...attacks, newAttack]);
    setExpandedAttacks([...expandedAttacks, true]);
  };

  const removeAttack = (index) => {
    setAttacks(attacks.filter((_, i) => i !== index));
    setExpandedAttacks(expandedAttacks.filter((_, i) => i !== index));
  };

  const toggleExpand = (index) => {
    const newExpandedAttacks = [...expandedAttacks];
    newExpandedAttacks[index] = !newExpandedAttacks[index];
    setExpandedAttacks(newExpandedAttacks);
  };

  const updateAttack = (index, field, value) => {
    const newAttacks = [...attacks];
    newAttacks[index][field] = value;
    setAttacks(newAttacks);
  };

  const addDamage = (attackIndex) => {
    const newAttacks = [...attacks];
    newAttacks[attackIndex].damages.push({
      name: "",
      diceCount: 1,
      diceType: 6,
      modifier: 0,
      type: "",
    });
    setAttacks(newAttacks);
  };

  const removeDamage = (attackIndex, damageIndex) => {
    const newAttacks = [...attacks];
    newAttacks[attackIndex].damages = newAttacks[attackIndex].damages.filter(
      (_, i) => i !== damageIndex
    );
    setAttacks(newAttacks);
  };

  const updateDamage = (attackIndex, damageIndex, field, value) => {
    const newAttacks = [...attacks];
    newAttacks[attackIndex].damages[damageIndex][field] = value;
    setAttacks(newAttacks);
  };

  const calculateHitRate = (ac, attack) => {
    const hitThreshold = ac - attack.attackModifier;
    let hitChance = Math.min(Math.max((21 - hitThreshold) / 20, 0.05), 0.95);

    if (advantage) {
      hitChance = 1 - (1 - hitChance) ** 2;
    } else if (disadvantage) {
      hitChance = hitChance ** 2;
    }

    return hitChance;
  };

  const calculateCumulativeHitRate = (ac, attacksNeeded) => {
    const hitChances = attacks.map((attack) => calculateHitRate(ac, attack));
    let cumulativeProbability = 0;

    for (let i = attacksNeeded; i <= attacks.length; i++) {
      cumulativeProbability += binomialProbability(
        attacks.length,
        i,
        hitChances
      );
    }

    return Number((cumulativeProbability * 100).toFixed(2));
  };

  const binomialProbability = (n, k, probabilities) => {
    const avgProbability =
      probabilities.reduce((a, b) => a + b, 0) / probabilities.length;
    return (
      combination(n, k) * avgProbability ** k * (1 - avgProbability) ** (n - k)
    );
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
        ...Array.from({ length: attacks.length }, (_, j) => ({
          [`hitRate${j + 1}`]: calculateCumulativeHitRate(ac, j + 1),
        })).reduce((acc, val) => ({ ...acc, ...val }), {}),
      };
    });
  };

  const calculateCritChance = (attack) => {
    if (attack.advantage) {
      return 1 - (19 / 20) ** 2;
    } else if (attack.disadvantage) {
      return (1 / 20) ** 2;
    } else {
      return 0.05;
    }
  };

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ];

  return (
    <div className="p-4">
      <h3>
        <a href="/">Home</a>
      </h3>
      <h2 className="text-2xl font-bold mb-4">
        D&D 5e Customizable Multi-Attack Hit Rate Calculator
      </h2>

      <div className="space-y-4 mb-4">
        {attacks.map((attack, attackIndex) => (
          <div key={attackIndex} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {attack.name || `Attack ${attackIndex + 1}`}
              </h3>
              <div className="flex space-x-2">
                <button
                  className="px-2 py-1 bg-gray-500 rounded"
                  onClick={() => toggleExpand(attackIndex)}
                >
                  {expandedAttacks[attackIndex] ? "▲" : "▼"}
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeAttack(attackIndex)}
                >
                  ✕
                </button>
              </div>
            </div>

            {expandedAttacks[attackIndex] && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`attack-name-${attackIndex}`}
                      className="block"
                    >
                      Attack Name
                    </label>
                    <input
                      id={`attack-name-${attackIndex}`}
                      type="text"
                      value={attack.name}
                      onChange={(e) =>
                        updateAttack(attackIndex, "name", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`attack-modifier-${attackIndex}`}
                      className="block"
                    >
                      Attack Modifier
                    </label>
                    <input
                      id={`attack-modifier-${attackIndex}`}
                      type="number"
                      value={attack.attackModifier}
                      onChange={(e) =>
                        updateAttack(
                          attackIndex,
                          "attackModifier",
                          parseInt(e.target.value)
                        )
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Damage Rolls</h4>
                  {attack.damages.map((damage, damageIndex) => (
                    <div key={damageIndex} className="border p-3 rounded">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor={`damage-name-${attackIndex}-${damageIndex}`}
                            className="block"
                          >
                            Damage Name
                          </label>
                          <input
                            id={`damage-name-${attackIndex}-${damageIndex}`}
                            type="text"
                            value={damage.name}
                            onChange={(e) =>
                              updateDamage(
                                attackIndex,
                                damageIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`damage-dice-count-${attackIndex}-${damageIndex}`}
                            className="block"
                          >
                            Dice Count
                          </label>
                          <input
                            id={`damage-dice-count-${attackIndex}-${damageIndex}`}
                            type="number"
                            min="1"
                            value={damage.diceCount}
                            onChange={(e) =>
                              updateDamage(
                                attackIndex,
                                damageIndex,
                                "diceCount",
                                parseInt(e.target.value)
                              )
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`damage-dice-type-${attackIndex}-${damageIndex}`}
                            className="block"
                          >
                            Dice Type
                          </label>
                          <select
                            id={`damage-dice-type-${attackIndex}-${damageIndex}`}
                            value={damage.diceType}
                            onChange={(e) =>
                              updateDamage(
                                attackIndex,
                                damageIndex,
                                "diceType",
                                parseInt(e.target.value)
                              )
                            }
                            className="border rounded px-2 py-1 w-full"
                          >
                            {[4, 6, 8, 10, 12, 20].map((die) => (
                              <option key={die} value={die}>
                                d{die}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor={`damage-modifier-${attackIndex}-${damageIndex}`}
                            className="block"
                          >
                            Damage Modifier
                          </label>
                          <input
                            id={`damage-modifier-${attackIndex}-${damageIndex}`}
                            type="number"
                            value={damage.modifier}
                            onChange={(e) =>
                              updateDamage(
                                attackIndex,
                                damageIndex,
                                "modifier",
                                parseInt(e.target.value)
                              )
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`damage-type-${attackIndex}-${damageIndex}`}
                            className="block"
                          >
                            Damage Type
                          </label>
                          <input
                            id={`damage-type-${attackIndex}-${damageIndex}`}
                            type="text"
                            value={damage.type}
                            onChange={(e) =>
                              updateDamage(
                                attackIndex,
                                damageIndex,
                                "type",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                      </div>
                      <button
                        className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => removeDamage(attackIndex, damageIndex)}
                      >
                        Remove Damage
                      </button>
                    </div>
                  ))}
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => addDamage(attackIndex)}
                  >
                    Add Damage Roll
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
          onClick={addAttack}
        >
          <span className="mr-2">+</span> Add Attack
        </button>

        <div className="col-span-2 flex justify-start space-x-4">
          <button
            onClick={toggleAdvantage}
            className={`px-4 py-2 rounded ${
              advantage ? "bg-green-500 text-white" : "bg-gray-600"
            }`}
          >
            Advantage
          </button>
          <button
            onClick={toggleDisadvantage}
            className={`px-4 py-2 rounded ${
              disadvantage ? "bg-red-500 text-white" : "bg-gray-600"
            }`}
          >
            Disadvantage
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 border rounded">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={generateData()}>
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
                value: "Cumulative Hit Rate (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{
                paddingTop: "5px",
              }}
            />
            {attacks.map((attack, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={`hitRate${i + 1}`}
                stroke={colors[i % colors.length]}
                name={attack.name || `Attack ${i + 1}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {attacks.length > 0 && <DamageSimulator attacks={attacks} />}
    </div>
  );
};

export default HitRateCalculator;
