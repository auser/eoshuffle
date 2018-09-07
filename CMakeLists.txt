cmake_minimum_required( VERSION 3.5 )

project( EOSSHUFFLE )

set(ROOT_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
# set(THIRD_PARTY_DIR "${ROOT_DIR}/third_party")
set(NODE_MOD_DIR "${ROOT_DIR}/node_modules")

# Boost dependency

# Include BoostLib module
file(GLOB_RECURSE boostlib_cmake_path "${NODE_MOD_DIR}" "BoostLib.cmake")
list(GET boostlib_cmake_path 0 boostlib_cmake_path)
get_filename_component(boostlib_cmake_path "${boostlib_cmake_path}" DIRECTORY)
SET(CMAKE_MODULE_PATH "${CMAKE_MODULE_PATH};${boostlib_cmake_path}")
include(BoostLib)

FIND_PACKAGE(Boost 1.67 REQUIRED COMPONENTS
    thread
    date_time
    filesystem
    system
    program_options
    signals
    serialization
    chrono
    unit_test_framework
    context
    locale
    iostreams)

# if(Boost_FOUND)
#     require_boost_libs(">= 1.58.0" thread;context;date_time;filesystem)
#     endif()
    include_directories(${boost_INCLUDE_DIRS})

set(OPENSSL_ROOT_DIR "${NODE_MOD_DIR}/nodegit/vendor/openssl/openssl")
# set(Secp256k1_LIBRARY "${THIRD_PARTY_DIR}/secp256k1/secp256k1-build")
# set(Secp256k1_INCLUDE_DIR "${THIRD_PARTY_DIR}/secp256k1/secp256k1-build/include")

# message("Secp256k1_LIBRARY: ${Secp256k1_LIBRARY} ${Secp256k1_INCLUDE_DIR}")

add_subdirectory("$ENV{HOME}/.eosio" "$ENV{HOME}/.eosio/build")
