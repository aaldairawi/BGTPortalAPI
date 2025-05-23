
using Microsoft.Data.SqlClient;
namespace API.Services
{
    public class DataBaseRepository : IDatabase
    {
        private readonly IConfiguration _configuration;
        
        public DataBaseRepository(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            
        }
        public async Task<T> ExecuteReaderAsync<T>(string database, string query,
        Func<SqlDataReader, Task<T>> reader, params SqlParameter[]  parameters)
        {
            try
            {
                using SqlConnection connection = new(_configuration.GetConnectionString(database));
                await connection.OpenAsync();
                using SqlCommand command = new(query, connection);
                command.Parameters.AddRange(parameters);
                using SqlDataReader dataReader = await command.ExecuteReaderAsync();
                return await reader(dataReader);
            }
            catch (SqlException sqlException)
            {
                throw new Exception($"An error occurred while executing the query: {sqlException.Message}");
            }
            catch (Exception exception)
            {
                throw new Exception($"An error occurred while executing the query: {exception.Message}");
            }
        }
    }
}