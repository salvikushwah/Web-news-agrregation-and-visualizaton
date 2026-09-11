
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function ChartSection({ data }) {
  return (
    <PieChart width={300} height={250}>
      <Pie data={data} dataKey="value" outerRadius={80}>
        {data.map((_, i) => (
          <Cell key={i} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}