#include "pet_widget.h"
#include <windows.h>

static LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    if (msg == WM_DESTROY) {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd,msg,wParam,lParam);
}

void PetWidget::show()
{
    WNDCLASS wc{};
    wc.lpfnWndProc = WndProc;
    wc.hInstance = GetModuleHandle(nullptr);
    wc.lpszClassName = L"DesktopPetWindow";
    RegisterClass(&wc);

    CreateWindowEx(
        WS_EX_LAYERED | WS_EX_TOOLWINDOW,
        wc.lpszClassName,
        L"Desktop Pet",
        WS_POPUP,
        100,100,200,200,
        nullptr,nullptr,wc.hInstance,nullptr);
}
