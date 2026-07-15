<?php

namespace App\Providers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Mailer\Bridge\Mailtrap\Transport\MailtrapTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;

class MailServiceProvider extends ServiceProvider
{
    /**
     * Register the Mailtrap Sending API as a Symfony Mailer transport.
     *
     * Laravel has no built-in "mailtrap" driver, so it must be wired manually
     * onto the Symfony Mailer bridge shipped by symfony/mailtrap-mailer.
     */
    public function boot(): void
    {
        Mail::extend('mailtrap', function (array $config = []) {
            return (new MailtrapTransportFactory)->create(
                new Dsn('mailtrap+api', 'default', $config['api_key'] ?? null)
            );
        });
    }
}
