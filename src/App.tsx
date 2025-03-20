import "./App.css";
import React from "react";
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

type Data = {
  name: string;
  uv: number;
  pv: number;
  amt: number;
  uvZScore?: number;
  pvZScore?: number;
};

const data: Data[] = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function App() {
  const meanValue = (arr: number[]) =>
    arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const stdDevValue = (arr: number[], mean: number) => {
    const stdDev =
      arr.reduce((acc, val) => acc + (val - mean) ** 2, 0) / arr.length;
    return Math.sqrt(stdDev);
  };

  const uvValues = data.map((el) => el.uv);
  const pvValues = data.map((el) => el.pv);

  const uvMeanValue = meanValue(uvValues);
  const pvMeanValue = meanValue(pvValues);

  const uvStdDevValue = stdDevValue(uvValues, uvMeanValue);
  const pvStdDevValue = stdDevValue(pvValues, pvMeanValue);

  const refactoredData: Data[] = data.map((obj) => ({
    ...obj,
    uvZScore: (obj.uv - uvMeanValue) / uvStdDevValue,
    pvZScore: (obj.pv - pvMeanValue) / pvStdDevValue,
  }));

  // const uvMaxZScore = refactoredData
  //   .map((obj) => obj.uvZScore)
  //   .filter((score) => score > 1);

  // const uvMaxZScore = Math.max(...refactoredData.map((obj) => obj.uvZScore));

  // const pvMaxZScore = Math.max(...refactoredData.map((obj) => obj.pvZScore));
  // const minScore = 1;

  // console.log("uvMax =>>", uvMaxZScore);
  // console.log("pvMaxZ =>>", pvMaxZScore);

  // console.log(
  //   "uvZScore =>>>>>",
  //   refactoredData.map((d) => d.uvZScore)
  // );

  const uvMaxZScore = Math.max(
    ...refactoredData.map((obj) => obj.uvZScore || 0)
  );
  const umMinZScore = Math.min(
    ...refactoredData.map((obj) => obj.uvZScore || 0)
  );

  const limiZScore = 1;

  const percentageStart =
    ((limiZScore - umMinZScore) / (uvMaxZScore - umMinZScore)) * 100;

  const percentageEnd =
    ((uvMaxZScore - umMinZScore) / (uvMaxZScore - umMinZScore)) * 100;

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={refactoredData} margin={{ top: 20 }} accessibilityLayer>
        <defs>
          <linearGradient id="splitColor" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#82c8ca" />
            <stop offset={`${percentageStart}%`} stopColor="#82c8ca" />
            <stop offset={`${percentageEnd}%`} stopColor="red" />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[-3, 3]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 6 }}
          yAxisId="left"
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" yAxisId="left" />

        <Line
          type="monotone"
          dataKey="uvZScore"
          stroke="url(#splitColor)"
          activeDot={(props) => (
            <circle
              cx={props.cx}
              cy={props.cy}
              r={6}
              fill={props.value >= 1 ? "red" : "#82ca9d"}
            />
          )}
          dot={(props) => (
            <circle
              cx={props.cx}
              cy={props.cy}
              r={4}
              fill={props.value >= 1 ? "red" : "#82c8ca"}
            />
          )}
          yAxisId="right"
        />
        {/* <Line
          type="monotone"
          dataKey="pvZScore"
          stroke="purple"
          dot={{ r: 6 }}
          yAxisId="right"
        /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}
