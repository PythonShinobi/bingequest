import smtplib
from threading import Thread
from email.mime.text import MIMEText

from config import Config

def _email(name, from_addr, message):
    # Constructing the email message.
    msg = f"Subject: New Message\n\nName: {name}\nEmail: {from_addr}\nMessage: {message}"
    mime_message = MIMEText(msg, 'plain', 'utf-8')

    # print(f"Connecting to {Config.MAIL_SERVER} on port {Config.MAIL_PORT} with TLS: {Config.MAIL_USE_TLS}")

    # Open a connection to the email server.
    with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as connection:        
        connection.starttls()  # Initiate a secure connection.
        connection.login(Config.RECIPIENT_EMAIL, Config.EMAIL_PASSWORD)  # Log in to the email server.
        connection.sendmail(
            from_addr=from_addr, 
            to_addrs=Config.RECIPIENT_EMAIL, 
            msg=mime_message.as_string()
        )

def send_email(name, from_addr, message):
    thread = Thread(
        target=_email,
        args=(name, from_addr, message)
    )
    thread.start()


# Example usage:
# You need to call send_email with appropriate parameters, such as sender's name, email, and message.
# The sender's email address should be provided as from_addr.