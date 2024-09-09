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

const SkillCheckCalculator = () => {
  const [attributes, setAttributes] = useState({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  const [level, setLevel] = useState(1);
  const [skills, setSkills] = useState([
    {
      name: "Acrobatics",
      attribute: "dexterity",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Animal Handling",
      attribute: "wisdom",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Arcana",
      attribute: "intelligence",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Athletics",
      attribute: "strength",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Deception",
      attribute: "charisma",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "History",
      attribute: "intelligence",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Insight",
      attribute: "wisdom",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Intimidation",
      attribute: "charisma",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Investigation",
      attribute: "intelligence",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Medicine",
      attribute: "wisdom",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Nature",
      attribute: "intelligence",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Perception",
      attribute: "wisdom",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Performance",
      attribute: "charisma",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Persuasion",
      attribute: "charisma",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Religion",
      attribute: "intelligence",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Sleight of Hand",
      attribute: "dexterity",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Stealth",
      attribute: "dexterity",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
    {
      name: "Survival",
      attribute: "wisdom",
      proficient: false,
      expertise: false,
      reliableTalent: false,
      selected: false,
    },
  ]);

  const updateAttribute = (attr, value) => {
    setAttributes({ ...attributes, [attr]: value });
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const calculateProficiencyBonus = (level) => {
    return Math.floor((level - 1) / 4) + 2;
  };

  const calculateSuccessRate = (dc, skill) => {
    const attrMod = calculateModifier(attributes[skill.attribute]);
    const profBonus = calculateProficiencyBonus(level);

    let modifier = attrMod;
    if (skill.proficient) modifier += profBonus;
    if (skill.expertise) modifier += profBonus;

    const successThreshold = dc - modifier;
    let successChance;

    if (skill.reliableTalent) {
      successChance = Math.min(
        Math.max((21 - Math.min(successThreshold, 11)) / 20, 0.05),
        1
      );
    } else {
      successChance = Math.min(
        Math.max((21 - successThreshold) / 20, 0.05),
        0.95
      );
    }

    return Number((successChance * 100).toFixed(2));
  };

  const generateData = () => {
    return Array.from({ length: 21 }, (_, i) => {
      const dc = i + 10;
      return {
        dc,
        ...skills.reduce((acc, skill, index) => {
          if (skill.selected) {
            acc[`successRate${index}`] = calculateSuccessRate(dc, skill);
          }
          return acc;
        }, {}),
      };
    });
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
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        Advanced D&D 5e Skill Check Calculator
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Attributes</h3>
          {Object.entries(attributes).map(([attr, value]) => (
            <div key={attr} className="flex items-center space-x-2 mb-2">
              <label htmlFor={attr} className="w-24 capitalize">
                {attr}
              </label>
              <input
                id={attr}
                type="number"
                value={value}
                onChange={(e) =>
                  updateAttribute(attr, parseInt(e.target.value))
                }
                className="w-20 border rounded px-2 py-1"
              />
              <span>({calculateModifier(value)})</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Character Level</h3>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className="w-20 border rounded px-2 py-1"
          />
          <p className="mt-2">
            Proficiency Bonus: +{calculateProficiencyBonus(level)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="grid grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`skill-${index}`}
                checked={skill.selected}
                onChange={(e) =>
                  updateSkill(index, "selected", e.target.checked)
                }
              />
              <label htmlFor={`skill-${index}`} className="w-32">
                {skill.name}
              </label>
              <input
                type="checkbox"
                id={`proficient-${index}`}
                checked={skill.proficient}
                onChange={(e) =>
                  updateSkill(index, "proficient", e.target.checked)
                }
              />
              <label htmlFor={`proficient-${index}`}>Prof</label>
              <input
                type="checkbox"
                id={`expertise-${index}`}
                checked={skill.expertise}
                onChange={(e) =>
                  updateSkill(index, "expertise", e.target.checked)
                }
              />
              <label htmlFor={`expertise-${index}`}>Exp</label>
              <input
                type="checkbox"
                id={`reliable-${index}`}
                checked={skill.reliableTalent}
                onChange={(e) =>
                  updateSkill(index, "reliableTalent", e.target.checked)
                }
              />
              <label htmlFor={`reliable-${index}`}>Reliable</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 border rounded">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={generateData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dc"
              label={{
                value: "Difficulty Class (DC)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Success Rate (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            {skills.map(
              (skill, i) =>
                skill.selected && (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`successRate${i}`}
                    stroke={colors[i % colors.length]}
                    name={skill.name}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillCheckCalculator;
