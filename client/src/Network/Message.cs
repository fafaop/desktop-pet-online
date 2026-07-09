namespace DesktopPet.Network;

public class Message
{
    public string Version { get; set; } = "1.0";
    public string Type { get; set; } = string.Empty;
    public string RequestId { get; set; } = string.Empty;
    public long Timestamp { get; set; }
    public object? Data { get; set; }
}
