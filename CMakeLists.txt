cmake_minimum_required( VERSION 3.5 )

project( SHUFFLE )

ADD_DEFINITIONS(-std=c++14)

## THIS NEEDS TO BE SHRANK TO JUST THE TOOLS WE ARE GOING TO USE
# ------------------------------------------------------------------------------------
##
# add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio")
##
# ------------------------------------------------------------------------------------
## Initial work below -- does NOT work yet

## TODO: Shrink the installation below to just build the required repo

set(THIRD_PARTY "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party")
set(ROOT_DIR "${THIRD_PARTY}/eosio")
set(LIBCLANG_DIR "${THIRD_PARTY}/libclangmm")

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake")

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release")
endif()

set(CMAKE_CXX_FLAGS         "${CMAKE_CXX_FLAGS} -Wall -Wextra")
set(CMAKE_CXX_FLAGS_DEBUG   "-O0 -g")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -g")

# set link-time optimization on if Release, INTERPROCEDURAL_OPTIMIZATION target property does not seem to work
if ("${CMAKE_CXX_COMPILER_ID}" MATCHES "Clang" OR "${CMAKE_CXX_COMPILER_ID}" MATCHES "GNU")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -flto")
endif()

# Include BoostLib module
file(GLOB_RECURSE boostlib_cmake_path "${CMAKE_CURRENT_SOURCE_DIR}/node_modules" "BoostLib.cmake")
list(GET boostlib_cmake_path 0 boostlib_cmake_path)
get_filename_component(boostlib_cmake_path "${boostlib_cmake_path}" DIRECTORY)
SET(CMAKE_MODULE_PATH "${CMAKE_MODULE_PATH};${boostlib_cmake_path}")
include(BoostLib)

# Locate/Download Boost (semver)
require_boost_libs(">= 1.59.0" "coroutine")
include_directories(${Boost_INCLUDE_DIRS})

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/libraries/fc/CMakeModules")
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/CMakeModules")
# list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/libclangmm")

# include( GNUInstallDirs )
# include( VersionMacros )
# include( SetupTargetMacros )
# include( InstallDirectoryPermissions )
# include( MASSigning )

# # include(wasm)
find_package(OpenSSL REQUIRED)
# add_subdirectory("${LIBCLANG_DIR}")
# find_package(LibClang REQUIRED)
# add_subdirectory("${LIBCLANG_DIR}")
# find_package(libclang REQUIRED)

# # find_package(Boost COMPONENTS filesystem REQUIRED)

# # add_compile_options(-std=c++14)
# # set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14 -fPIC -w ")

include_directories(
    "/usr/local/wasm/include/clang"
    "${ROOT_DIR}/libraries/fc/include"
    "${ROOT_DIR}/libraries/chainbase/include"
    "${ROOT_DIR}/libraries/chain/include"
    "${ROOT_DIR}/libraries/abi_generator/include"
    "${ROOT_DIR}/libraries/wasm-jit/include"
    "${ROOT_DIR}/libraries/abi_generator/include/eosio/abi_generator"
)

add_definitions(
    -D_REENTRANT
    -D_GNU_SOURCE
    -DCLANG_SEARCH_PATH="${LIBCLANG_SEARCH_PATH}"
    -Dclang_EXPORTS
    ${LIBCLANG_DEFINITIONS}
)

include_directories(SYSTEM
    ${LIBCLANG_INCLUDE_DIR}
    ${Boost_INCLUDE_DIRS}
    ${CMAKE_JS_INC}
)

#     # add_subdirectory( "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/externals" )
#     # add_subdirectory( "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/libraries/fc" )
#   # add_subdirectory( "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/programs/eosio-abigen")
#   # add_subdirectory( "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/programs" )
# # add_subdirectory( "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/tools" )

file(GLOB_RECURSE abigen_source_files

# #   "${ROOT_DIR}/**/*.h"
# #   "${ROOT_DIR}/**/*.hpp"
  "${ROOT_DIR}/libraries/abi_generator/include/*/*.hpp"
)

add_executable(eosio-abigen "${ROOT_DIR}/programs/eosio-abigen/main.cpp")
# target_link_libraries(  eosio-abigen OpenSSL::SSL)
