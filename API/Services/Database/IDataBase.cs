
using Microsoft.Data.SqlClient;

namespace API.Services.Database;

public interface IDatabase
{
    /// <summary>
    /// Returns a T represeting a result from a read only query.
    /// </summary>
    /// <typeparam name="T">The result of the query.</typeparam>
    /// <param name="database"></param>
    /// <param name="query"></param>
    /// <param name="reader"></param>
    /// <param name="parameters"></param>
    /// <returns> A <see cref="T"/> based on the result from a SQL query.</returns>
    Task<T> ExecuteReaderAsync<T>(string database, string query,
    Func<SqlDataReader, Task<T>> reader,
     params SqlParameter[] parameters);


    /// <summary>
    /// Returns the number of rows affect in a Insert, Update or Delete query.
    /// </summary>
    /// <param name="database"></param>
    /// <param name="query"></param>
    /// <param name="parameters"></param>
    /// <returns>The number of rows affected by the SQL query.</returns>
    Task<int> ExecuteSqlQuery(string database, string query, params SqlParameter[] parameters);
    /// <summary>
    /// Returns the first column selected in the SQL query.  
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="database"></param>
    /// <param name="query"></param>
    /// <param name="parameters"></param>
    /// <returns>The first column <see cref="Id"/> from a SQL query.</returns>
    Task<T> ExecuteScalarAsync<T>(string database, string query, SqlParameter[] parameters);

}
