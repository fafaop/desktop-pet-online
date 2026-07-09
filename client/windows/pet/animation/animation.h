#pragma once
#include <string>

class Animation {
public:
    void setState(const std::string& state);
    void update();
    std::string state() const;

private:
    std::string currentState = "idle";
};
