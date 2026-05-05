using System.Net;
using System.Net.Mail;

namespace TheUpperRoom.Api.Services;

public class EmailSender(IConfiguration config, ILogger<EmailSender> logger)
{
    public async Task SendAsync(string to, string subject, string body)
    {
        var host = config["Smtp:Host"];
        if (string.IsNullOrEmpty(host))
        {
            logger.LogWarning("SMTP not configured; skipping email to {To}", to);
            return;
        }

        var port = config.GetValue<int>("Smtp:Port", 25);
        var from = config["Smtp:From"] ?? "noreply@theupperroom.app";

        using var client = new SmtpClient(host, port);
        await client.SendMailAsync(new MailMessage(from, to, subject, body));
    }
}
