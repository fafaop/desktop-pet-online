using System;
using System.Threading;
using System.Threading.Tasks;

namespace DesktopPet.Network;

public class HeartbeatService
{
    public async Task RunAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            // TODO send HEARTBEAT_REQUEST
            await Task.Delay(TimeSpan.FromSeconds(30), token);
        }
    }
}
