import React, {useState} from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DamageSimulator from "./DamageSimulator";

const AnimateObjects = () => {
    cosnt [count, setCount] = useState(10);

    const tiny = {
        HP: 20,
        AC: 18,
        Str: 4,
        Dex: 18,
        Attack: 8,
        DiceCount: 1,
        DiceType: 4,
        DamageMod: 4
    };

    const small = {
        HP: 25,
        AC: 16,
        Str: 6,
        Dex: 14,
        Attack: 6,
        DiceCount: 1,
        DiceType: 8,
        DamageMod: 2
    };


    return (

    )
};

export default AnimateObjects;