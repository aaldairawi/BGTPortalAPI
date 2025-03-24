
using API.Dtos.CtypeInvoice;
using API.Helper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class CInvoiceTypeRepository : ICInvoiceType
    {
        private readonly IConfiguration _configuration;
        public CInvoiceTypeRepository(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

        }
        public async Task<List<CTypeDto>> GetAllCInvoiceTypes()
        {
            List<CTypeDto> result = [];
            var query = Container_SQL_Queries.GetAllCInvoiceTypes();
            using (SqlConnection connection = new(_configuration.GetConnectionString("BillingN4DatabaseConnection")))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                result.Add(new CTypeDto(reader["TypeGroup"].ToString() ?? ""));
                            }
                        }
                    }
                }
            }
            if (result is null) return null!;
            return result;
        }
    }
}