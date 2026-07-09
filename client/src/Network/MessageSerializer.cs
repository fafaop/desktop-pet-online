using System.Text.Json;

namespace DesktopPet.Network;

public static class MessageSerializer
{
    public static string Serialize(Message message)
    {
        return JsonSerializer.Serialize(message);
    }

    public static Message? Deserialize(string json)
    {
        return JsonSerializer.Deserialize<Message>(json);
    }
}
