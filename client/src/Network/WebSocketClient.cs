using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace DesktopPet.Network;

public class WebSocketClient
{
    private ClientWebSocket socket = new();

    public async Task ConnectAsync(string url)
    {
        await socket.ConnectAsync(new Uri(url), CancellationToken.None);
    }

    public bool Connected => socket.State == WebSocketState.Open;
}
