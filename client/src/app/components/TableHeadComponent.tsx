import { TableRow, TableCell, TableHead } from "@mui/material";
import { tableHeadTableCellStyles } from "../../features/admin/tableCssStyles";

interface Props {
  tableCellHeadings: string[];
}

const TableHeadComponent: React.FC<Props> = (props: Props) => {
  const { tableCellHeadings } = props;
  return (
    <TableHead sx={{ borderBottom: "1px solid white" }}>
      <TableRow>
        {tableCellHeadings.map((headertitle) => (
          <TableCell key={headertitle} sx={tableHeadTableCellStyles}>
            {headertitle}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeadComponent;
