using System.Windows;

namespace DesktopPet;

public partial class LoginWindow : Window
{
    public LoginWindow()
    {
        InitializeComponent();
    }

    private async void Login_Click(object sender, RoutedEventArgs e)
    {
        // TODO: call NetworkManager login API
        MessageBox.Show("Login request sent");
        await System.Threading.Tasks.Task.CompletedTask;
    }
}
