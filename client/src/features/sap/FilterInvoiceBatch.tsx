import { Typography, Box, Button, Popover } from "@mui/material";
import Calendar from "../../app/components/Calendar";
import { InvoiceFilterMenu } from "../../app/components/InvoiceFilterMenu";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import React, { useState } from "react";
import { setCTypeInvoiceParams } from "./consigneeInvoices/consigneeInvoiceSlice";

import { getConsigneeInvoicesThunk } from "./consigneeInvoices/getConsigneeInvoicesThunk";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

type Props = {
  invoicesLoading: boolean;
};

export function FilterInvoiceBatch({ invoicesLoading }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { cTypeInvoiceParams } = useAppSelector(
    (state) => state.consigneeInvoices
  );

  const { cType } = useAppSelector((state) => state.invoiceFilters);

  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl && !invoicesLoading);

  return (
    <>
      <LoadingButton
        fullWidth
        loading={invoicesLoading}
        onClick={(event) => handleClick(event)}
        sx={{ cursor: "pointer" }}
        variant="contained"
      >
        Filter By Finalized Date
      </LoadingButton>
      {open && (
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
                  dispatch(
                    setCTypeInvoiceParams({ invoiceType: event.target.value })
                  )
                }
                items={cType.invoiceTypeFilters}
                value={cTypeInvoiceParams.invoiceType}
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
                    cTypeInvoiceParams.dateFinalized
                      ? dayjs(cTypeInvoiceParams.dateFinalized)
                      : dayjs()
                  }
                  onChange={(dateFinalized) =>
                    dispatch(
                      setCTypeInvoiceParams({
                        dateFinalized: dateFinalized.format(
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                      })
                    )
                  }
                />
                <Button
                  onClick={() => {
                    dispatch(getConsigneeInvoicesThunk());
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
      )}
    </>
  );
}

export default FilterInvoiceBatch;
