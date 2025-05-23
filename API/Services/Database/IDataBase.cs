
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public interface IDatabase
    {
        Task<T> ExecuteReaderAsync<T>(string database, string query,
        Func<SqlDataReader, Task<T>> reader,
         params SqlParameter[] parameters);

    }
}