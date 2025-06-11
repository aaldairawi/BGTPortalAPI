
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public interface IDatabase
    {
        Task<T> ExecuteReaderAsync<T>(string database, string query,
        Func<SqlDataReader, Task<T>> reader,
         params SqlParameter[] parameters);

        Task<int>  ExecuteSqlQuery(string database, string query, params SqlParameter[] parameters);
        Task<T> ExecuteScalarAsync<T>(string database, string query, SqlParameter[] parameters);
    }
}