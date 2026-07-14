<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['email' => 'teste@stlshypper.test', 'name' => 'Usuário Teste'],
            ['email' => 'teste2@stlshypper.test', 'name' => 'Usuário Teste 2'],
            ['email' => 'teste3@stlshypper.test', 'name' => 'Usuário Teste 3'],
            ['email' => 'teste4@stlshypper.test', 'name' => 'Usuário Teste 4'],
        ];

        foreach ($users as $data) {
            User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
