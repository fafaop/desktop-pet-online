using System;

namespace DesktopPet.Network;

public class HeartbeatClient
{
    public event Action? OnHeartbeat;

    public void SendHeartbeat()
    {
        OnHeartbeat?.Invoke();
    }
}
