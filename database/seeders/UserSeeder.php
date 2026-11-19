<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(['email' => 'admin@propspace.id'], [
            'name' => 'Admin PropSpace',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::firstOrCreate(['email' => 'agen@propspace.id'], [
            'name' => 'Budi Agen',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'phone' => '08123456789',
        ]);

        User::firstOrCreate(['email' => 'buyer@propspace.id'], [
            'name' => 'Sari Buyer',
            'password' => bcrypt('password'),
            'role' => 'buyer',
        ]);
    }
}
