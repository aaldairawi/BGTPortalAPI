import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { StrippingContainer } from "../../app/models/stripping/stripping.types";
import TableHeadComponent from "../../app/components/TableHeadComponent";
import { StrippedUnit } from "./StrippedUnit";

type Props = {
  strippedContainerList: StrippingContainer[];
};

export function StrippedUnitsList({ strippedContainerList }: Props) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 4,
        maxHeight: 425,
        overflowY: "auto",
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 800,
          width: "100%",
        }}
      >
        <TableHeadComponent
          tableCellHeadings={[
            "No",
            "Container",
            "Line",
            "ISO",
            "Size",
            "Date",
            "Labor",
            "Driver",
            "Berth",
            "Update",
          ]}
        />
        <TableBody>
          {strippedContainerList.map((strippedContainer, index) => (
            <StrippedUnit
              strippedContainer={strippedContainer}
              index={index}
              key={strippedContainer.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
