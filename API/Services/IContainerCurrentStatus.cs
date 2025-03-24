using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos.CargoContainer;

namespace API.Services
{
    public interface IContainerCurrentStatus
    {

                Task<ContainerCurrentStatusDto> GetContainerCurrentStatus(string id);
        
    }
}