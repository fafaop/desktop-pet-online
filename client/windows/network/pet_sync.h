#pragma once
#include "../pet/pet_state.h"

class PetSync {
public:
    void update(const PetState& state);
    PetState current() const;

private:
    PetState state;
};
