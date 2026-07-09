using System.Threading.Tasks;

namespace DesktopPet.Network;

public class NetworkManager
{
    private readonly WebSocketClient client = new();

    public async Task StartAsync()
    {
        await client.ConnectAsync("ws://127.0.0.1:8080/ws");
    }
}
