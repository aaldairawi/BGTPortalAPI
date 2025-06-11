import { Typography, Box, Button, Popover } from "@mui/material";
import Calendar from "../../app/components/Calendar";
import { InvoiceFilterMenu } from "../../app/components/InvoiceFilterMenu";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import React, { useState } from "react";
import { setCTypeInvoiceParams } from "./ctype/cTypeInvoiceSlice";
import { setSTypeInvoiceParams } from "./stype/sTypeInvoicSlice";
import { getSTypeInvoicesThunk } from "./stype/getSTypeInvoicesThunk";
import { getCTypeInvoicesThunk } from "./ctype/getCTypeInvoicesThunk";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

type InvoiceType = "S" | "C";

type Props = {
  invoiceTypeToPass: InvoiceType;
  invoicesLoading: boolean;
};

export function FilterInvoiceBatch({
  invoiceTypeToPass,
  invoicesLoading,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { sTypeInvoiceParams } = useAppSelector((state) => state.sTypeInvoices);
  const { cTypeInvoiceParams } = useAppSelector((state) => state.cTypeInvoices);

  const { cType, sType } = useAppSelector((state) => state.invoiceFilters);

  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setInvoiceParams =
    invoiceTypeToPass === "C" ? setCTypeInvoiceParams : setSTypeInvoiceParams;

  const invoiceParams =
    invoiceTypeToPass === "C" ? cTypeInvoiceParams : sTypeInvoiceParams;

  const getInvoicesThunk =
    invoiceTypeToPass === "C" ? getCTypeInvoicesThunk : getSTypeInvoicesThunk;

  const open = Boolean(anchorEl && !invoicesLoading); // Invoices loading than hide the menu. invoices loading = true => !true = false.
  
  

  return (
    <>
      <LoadingButton
        fullWidth
        loading={invoicesLoading} // If invoices are loading than true.
        onClick={(event) => handleClick(event)}
        sx={{ cursor: "pointer" }}
        variant="contained"
      >
        Filter Batch
      </LoadingButton>
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
              items={
                invoiceTypeToPass === "C"
                  ? cType.invoiceTypeFilters
                  : sType.invoiceTypeFilters
              }
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
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Calendar
                value={
                  invoiceParams.dateFinalized
                    ? dayjs(invoiceParams.dateFinalized)
                    : dayjs()
                }
                onChange={(dateFinalized) =>
                  dispatch(
                    setInvoiceParams({
                      dateFinalized: dateFinalized.format(
                        "YYYY-MM-DDTHH:mm:ss"
                      ),
                    })
                  )
                }
              />
              <Button
                onClick={() => {
                  dispatch(getInvoicesThunk());
                  handleClose();
                }}
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
}

export default FilterInvoiceBatch;
