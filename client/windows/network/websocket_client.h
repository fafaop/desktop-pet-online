#pragma once
#include <string>

class WebSocketClient {
public:
    bool connect(const std::string& url);
    void login(const std::string& id,const std::string& name);
};
