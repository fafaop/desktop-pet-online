using System;

namespace DesktopPet.Network;

public class EventDispatcher
{
    public event Action<Message>? MessageReceived;

    public void Dispatch(Message message)
    {
        MessageReceived?.Invoke(message);
    }
}
