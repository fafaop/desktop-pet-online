using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DesktopPet.Network;

public class WebSocketClient
{
    private readonly ClientWebSocket socket = new();

    public async Task ConnectAsync(string url)
    {
        await socket.ConnectAsync(new Uri(url), CancellationToken.None);
    }

    public bool Connected => socket.State == WebSocketState.Open;

    public async Task SendAsync(string message)
    {
        var data = Encoding.UTF8.GetBytes(message);
        await socket.SendAsync(
            data,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
    }
}
