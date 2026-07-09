#include "animation.h"

void Animation::setState(const std::string& state)
{
    currentState = state;
}

void Animation::update()
{
    // reserved for frame update
}

std::string Animation::state() const
{
    return currentState;
}
