cmake_minimum_required(VERSION 3.20)
project(desktop_pet_client)

set(CMAKE_CXX_STANDARD 17)

add_executable(desktop_pet_client
    main.cpp
    pet/pet_widget.cpp
    network/websocket_client.cpp
)

include_directories(.)
