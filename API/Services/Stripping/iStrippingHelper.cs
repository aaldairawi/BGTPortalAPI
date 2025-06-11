using API.Dtos.Stripping;
using API.Dtos.Stripping.StrippingDriver;
using API.Dtos.Stripping.StrippingLabor;

namespace API.Services.Stripping;

public interface IStrippingHelper
{

    Task<bool> DeleteStrippingDriver(int driverId);

    Task<StrippingDriverDto> CreateStrippingDriver(CreateStrippingDriverDto createStrippingDriver);

    Task<List<StrippingDriverDto>> GetAllStrippingDrivers();
    Task<List<StrippingLaborTypeDto>> GetAllStrippingLaborTypes();
    Task<StrippingLaborTypeDto> CreateStrippingLabor(CreateStrippingLaborTypeDto createStrippingLabor);
    Task<bool> DeleteStrippingLabor(int laborTypeId);
    
}
