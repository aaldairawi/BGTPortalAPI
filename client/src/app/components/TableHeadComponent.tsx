import { TableRow, TableCell, TableHead } from "@mui/material";

interface Props {
  tableCellHeadings: string[];
}

const TableHeadComponent: React.FC<Props> = (props: Props) => {
  const { tableCellHeadings } = props;
  return (
    <TableHead >
      <TableRow >
        {tableCellHeadings.map((headertitle) => (
          <TableCell sx={{ textAlign: "center", backgroundColor: "#fafafa" }} key={headertitle}>
            {headertitle}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeadComponent;
