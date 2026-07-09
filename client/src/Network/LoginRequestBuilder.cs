using System.Text.Json;

namespace DesktopPet.Network;

public static class LoginRequestBuilder
{
    public static string Build(string username, string password)
    {
        return JsonSerializer.Serialize(new
        {
            type = "LOGIN_REQUEST",
            data = new { username, password }
        });
    }
}
