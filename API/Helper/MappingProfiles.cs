
using API.Dtos.Role;
using API.Dtos.User;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Helper
{
    public class MappingProfiles : Profile
    {

        public MappingProfiles()
        {
            CreateMap<User, UserDto>();
            CreateMap<User, UpdateUserDto>();
            // CreateMap<IdentityRole, GetRoleDto>();
            // CreateMap<GetRoleDto, IdentityRole>();
            CreateMap<CreateRoleDto, Role>();

        }
    }
}