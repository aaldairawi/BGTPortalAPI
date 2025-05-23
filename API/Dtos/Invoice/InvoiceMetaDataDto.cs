using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos.Invoice
{
    public class InvoiceMetaDataDto
    {
        public required  string InvoiceFinalNumber {get; set;}
        public DateTime InvoiceFinalizedDate {get; set;} 
        public required string CustomerName {get;set;}
        public required string CustomerSapCode {get; set;}
        public required string TotalAmount {get; set;}
        public required string UnitFacilityVisitGkey {get; set;}
        public required string ProfitCenter {get; set;}
        public required string InvoiceNotes {get; set;}
        public required string InvoiceCurrency {get; set;}
    
    
    }
}