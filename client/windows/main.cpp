#include <windows.h>
#include "pet/pet_widget.h"
#include "network/websocket_client.h"

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE, LPSTR, int)
{
    PetWidget pet;
    pet.show();

    WebSocketClient client;
    client.connect("ws://localhost:8080/ws");
    client.login("windows-user", "DesktopPet");

    MSG msg{};
    while (GetMessage(&msg, nullptr, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}
