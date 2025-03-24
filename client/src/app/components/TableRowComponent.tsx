import { TableRow, TableCell } from "@mui/material";
import { tableBodyTableCellStyles } from "../../features/admin/tableCssStyles";

interface Props {
  tableRowCellHeadings: string[];
}
const TableRowComponent: React.FC<Props> = (props: Props) => {
  const { tableRowCellHeadings } = props;
  return (
    <TableRow
      sx={{
        border: "none",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "grey.800",
        },
      }}
    >
      {tableRowCellHeadings.map((tableCellHeading, index) => (
        <TableCell key={index} sx={tableBodyTableCellStyles}>
          {tableCellHeading}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowComponent;
