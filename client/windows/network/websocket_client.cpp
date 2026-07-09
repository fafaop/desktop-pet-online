#include "websocket_client.h"
#include <iostream>

bool WebSocketClient::connect(const std::string& url)
{
    std::cout << "connect " << url << std::endl;
    return true;
}

void WebSocketClient::login(const std::string& id,const std::string& name)
{
    std::cout << "login " << id << " " << name << std::endl;
}
