
using API.Helper;
using Microsoft.Data.SqlClient;


namespace API.Services.Database;

public class DataBaseRepository : IDatabase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<DataBaseRepository> _logger;
    public DataBaseRepository(IConfiguration configuration, ILogger<DataBaseRepository> logger)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    }
    public async Task<T> ExecuteReaderAsync<T>(string database, string query,
    Func<SqlDataReader, Task<T>> reader, params SqlParameter[] parameters)
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
            _logger.LogError(sqlException, "An SqlException occured while reading the records: {message}", sqlException.Message);
            throw;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "An exception occured while reading the rows {message}", exception.Message);
            throw new Exception($"An error occurred while executing the query: {exception.Message}");
        }
    }

    public async Task<T> ExecuteScalarAsync<T>(string database, string query, SqlParameter[] parameters)
    {
        try
        {
            using SqlConnection connection = new(_configuration.GetConnectionString(database));
            await connection.OpenAsync();
            using SqlCommand command = new(query, connection);

            if (parameters is not null && parameters.Length > 0)
            {
                command.Parameters.AddRange(parameters);
            }
            object? result = await command.ExecuteScalarAsync();
            if (result is null || result == DBNull.Value) return default!;
            return (T)Convert.ChangeType(result, typeof(T))!;
            
        }
        catch (SqlException sqlException)
        {
            WriteLine($"An sql exception occured {sqlException}");
            throw;
        }
        catch (Exception exc)
        {
            WriteLine($"An exception occured {exc}");
            throw;
        }
    }

    public async Task<int> ExecuteSqlQuery(string database, string query, params SqlParameter[] parameters)
    {

        try
        {
            using SqlConnection connection = new(_configuration.GetConnectionString(database));
            await connection.OpenAsync();

            using SqlCommand command = new(query, connection);
            if (parameters is not null && parameters.Length > 0)
            {
                command.Parameters.AddRange(parameters);
            }
            return await command.ExecuteNonQueryAsync();

        }
        catch (SqlException sqlException)
        {
            WriteLine( $"An SqlException {sqlException.Message}");
    
            throw;
        }
        catch (Exception exception)
        {
            WriteLine($"An exception occured {exception}");

            throw;
        }
    }
    

}
