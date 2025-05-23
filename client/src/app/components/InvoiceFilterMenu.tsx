/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuItem, Select } from "@mui/material";
import { InvoiceFilters } from "../models/invoice/invoice.types";

interface Props {
  items: InvoiceFilters[];
  onChange: (event: any) => void;
  value: string;
}
export function InvoiceFilterMenu({ items, onChange, value }: Props) {
  return (
    <Select onChange={onChange} value={value} sx={{ textAlign: "center" }}>
      {items.map(({ value }) => (
        <MenuItem value={value} key={value}>
          {value}
        </MenuItem>
      ))}
    </Select>
  );
}
