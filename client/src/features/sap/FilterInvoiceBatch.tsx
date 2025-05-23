import { Typography, Box, Button, Popover } from "@mui/material";
import Calendar from "../../app/components/Calendar";
import { InvoiceFilterMenu } from "../../app/components/InvoiceFilterMenu";
import { dateObjectOptions } from "../../app/helper/dateOptions";
import { setInvoiceParams } from "./finalizedInvoicesSlice";
import { getAllFinalizedInvoicesAsync } from "./getAllFinalizedInvoicesThunk";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import React, { useState } from "react";
import { InvoiceFilters } from "../../app/models/invoice/invoice.types";

const hideSlInvoiceTypesFromIraqFinance = (
  input: InvoiceFilters[],
  isUserDubaiFinanceOrAdmin: boolean
): InvoiceFilters[] => {

  if (isUserDubaiFinanceOrAdmin) {
    return input;
  }
  return input.filter((element) => element.value.charAt(0) !== "S");
};


const FilterInvoiceBatch = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { invoiceParams, invoiceTypeFilters, invoiceOrderByFilters } =
    useAppSelector((state) => state.finalizedInvoices);

  const { user } = useAppSelector((state) => state.account);

  const filteredInvoiceTypes: InvoiceFilters[] =
    hideSlInvoiceTypesFromIraqFinance(
      invoiceTypeFilters,
      user!.roles!.includes("DubaiFinance") || user!.roles!.includes("Admin")
    );

  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    console.log("Anchor set");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Button
        onClick={(event) => handleClick(event)}
        sx={{ cursor: "pointer" }}
        variant="contained"
      >
        Filter Batch
      </Button>
      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "row",
            gap: 2,
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                width: "100%",
              }}
            >
              Invoice
            </Typography>
            <InvoiceFilterMenu
              onChange={(event) =>
                dispatch(setInvoiceParams({ invoiceType: event.target.value }))
              }
              items={filteredInvoiceTypes}
              value={invoiceParams.invoiceType}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                width: "100%",
              }}
            >
              Order By
            </Typography>
            <InvoiceFilterMenu
              onChange={(event) =>
                dispatch(setInvoiceParams({ orderBy: event.target.value }))
              }
              items={invoiceOrderByFilters}
              value={invoiceParams.orderBy}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Calendar
                onChange={(dateFinalized) =>
                  dispatch(
                    setInvoiceParams({
                      dateFinalized: new Date(
                        dateFinalized.toString()
                      ).toLocaleString("en-US", dateObjectOptions),
                    })
                  )
                }
              />
              <Button
                onClick={() => dispatch(getAllFinalizedInvoicesAsync())}
                variant="contained"
                fullWidth
              >
                Apply Filter
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FilterInvoiceBatch;
