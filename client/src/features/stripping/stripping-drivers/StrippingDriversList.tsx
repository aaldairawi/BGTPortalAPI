import { TableContainer, Paper, Table, TableBody } from "@mui/material";
import TableHeadComponent from "../../../app/components/TableHeadComponent";

import { StrippingDriver } from "./StrippingDriver";
import { useAppSelector } from "../../../app/store/configureStore";
import { strippingDriversSelector } from "./strippingDriversSlice";

export function StrippingDriversList() {
  const strippingDriversList = useAppSelector(
    strippingDriversSelector.selectAll
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 0,
        maxHeight: 425,
        maxWidth: 900,
        overflowY: "auto",
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 800,
          maxWidth: 1000,
          width: "100%",
        }}
      >
        <TableHeadComponent
          tableCellHeadings={["No", "Name", "Creator", "Action"]}
        />
        <TableBody>
          {strippingDriversList.map((driver, index) => (
            <StrippingDriver
              strippingDriver={driver}
              index={index}
              key={driver.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StrippingDriversList;
