using System.Threading.Tasks;

namespace DesktopPet.Network;

public class LoginClient
{
    private readonly WebSocketClient client;

    public LoginClient(WebSocketClient client)
    {
        this.client = client;
    }

    public Task LoginAsync(string username, string password)
    {
        // TODO send LOGIN_REQUEST
        return Task.CompletedTask;
    }
}
