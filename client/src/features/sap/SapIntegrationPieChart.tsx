import { PieChart } from "@mui/x-charts/PieChart";
import React from "react";

interface Props {
  invoiceFinalizedData: { ctype: number; sl1Type: number; sl2Type: number };
}

const SapIntegrationPieChart: React.FC<Props> = (props: Props) => {
  const { invoiceFinalizedData } = props;
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: invoiceFinalizedData.ctype, label: "C Type" },
            { id: 1, value: invoiceFinalizedData.sl1Type, label: "SL1 Type" },
            { id: 2, value: invoiceFinalizedData.sl2Type, label: "SL2 Type" },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
};

export default SapIntegrationPieChart;
