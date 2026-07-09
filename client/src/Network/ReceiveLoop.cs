using System.Threading;
using System.Threading.Tasks;

namespace DesktopPet.Network;

public class ReceiveLoop
{
    public async Task StartAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            // TODO receive websocket messages
            await Task.Delay(10, token);
        }
    }
}
