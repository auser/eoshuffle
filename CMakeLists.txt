cmake_minimum_required( VERSION 3.5 )

project( SHUFFLE )

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio")

# ## TODO: Shrink the installation below to just build the required repo

# set(THIRD_PARTY "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party")
# set(ROOT_DIR "${THIRD_PARTY}/eosio")
# set(LIBCLANG_DIR "/usr/local/opt/llvm@4/")

# # Boost dependency

# # Include BoostLib module
# file(GLOB_RECURSE boostlib_cmake_path "${CMAKE_CURRENT_SOURCE_DIR}/node_modules" "BoostLib.cmake")
# list(GET boostlib_cmake_path 0 boostlib_cmake_path)
# get_filename_component(boostlib_cmake_path "${boostlib_cmake_path}" DIRECTORY)
# SET(CMAKE_MODULE_PATH "${CMAKE_MODULE_PATH};${boostlib_cmake_path}")
# include(BoostLib)

# FIND_PACKAGE(Boost 1.67 REQUIRED COMPONENTS
#     thread
#     date_time
#     filesystem
#     system
#     program_options
#     signals
#     serialization
#     chrono
#     unit_test_framework
#     context
#     locale
#     iostreams)

# if(Boost_FOUND)
#     require_boost_libs(">= 1.58.0" "coroutine")
#     include_directories(${boost_INCLUDE_DIRS})
# endif()

# list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/libraries/fc/CMakeModules")
# list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/src/third_party/eosio/CMakeModules")

# include( GNUInstallDirs )
# include( VersionMacros )
# include( SetupTargetMacros )
# include( InstallDirectoryPermissions )
# include( MASSigning )

# include(wasm)

# include_directories(
#     "/usr/local/wasm/include/clang"
#     "/usr/local/include"
#     "${LIBCLANG_DIR}/include"
#     "${ROOT_DIR}/libraries/fc/include"
#     "${ROOT_DIR}/libraries/chainbase/include"
#     "${ROOT_DIR}/libraries/chain/include"
#     "${ROOT_DIR}/libraries/abi_generator/include"
#     "${ROOT_DIR}/libraries/wasm-jit/include"
#     "${ROOT_DIR}/libraries/abi_generator/include/eosio/abi_generator"
#     "${ROOT_DIR}/contracts/eosiolib"
# )

# include_directories(SYSTEM
#     ${LIBCLANG_INCLUDE_DIR}
#     ${Boost_INCLUDE_DIRS}
#     ${CMAKE_JS_INC}
# )

# add_subdirectory("${ROOT_DIR}/contracts")

# add_subdirectory("${ROOT_DIR}/libraries/abi_generator")
# add_subdirectory("${ROOT_DIR}/tools")
