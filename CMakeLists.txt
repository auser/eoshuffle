cmake_minimum_required( VERSION 3.5 )

project( EOSSHUFFLE )

set(ROOT_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(THIRD_PARTY_DIR "${ROOT_DIR}/src/third_party")
set(NODE_MOD_DIR "${ROOT_DIR}/node_modules")

# Boost dependency

# Include BoostLib module
file(GLOB_RECURSE boostlib_cmake_path "${NODE_MOD_DIR}/node_modules" "BoostLib.cmake")
list(GET boostlib_cmake_path 0 boostlib_cmake_path)
get_filename_component(boostlib_cmake_path "${boostlib_cmake_path}" DIRECTORY)
SET(CMAKE_MODULE_PATH "${CMAKE_MODULE_PATH};${boostlib_cmake_path}")
include(BoostLib)

message("boot dir: ${boostlib_cmake_path}")
FIND_PACKAGE(Boost 1.58 REQUIRED COMPONENTS
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

if(Boost_FOUND)
    require_boost_libs(">= 1.58.0" "coroutine")
    include_directories(${boost_INCLUDE_DIRS})
endif()

set(OPENSSL_ROOT_DIR "${NODE_MOD_DIR}/nodegit/vendor/openssl/openssl")
set(Secp256k1_LIBRARY "${THIRD_PARTY_DIR}/secp256k1/build/Release")
set(Secp256k1_INCLUDE_DIR "${NODE_MOD_DIR}/secp256k1/src/secp256k1-src/include")

add_subdirectory("$ENV{HOME}/.eosio" "$ENV{HOME}/.eosio/build")
