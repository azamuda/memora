<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Rumah',      'slug' => 'rumah',      'icon' => '🏠'],
            ['name' => 'Apartemen',  'slug' => 'apartemen',  'icon' => '🏢'],
            ['name' => 'Tanah',      'slug' => 'tanah',      'icon' => '🌍'],
            ['name' => 'Ruko',       'slug' => 'ruko',       'icon' => '🏪'],
            ['name' => 'Villa',      'slug' => 'villa',      'icon' => '🏡'],
            ['name' => 'Gudang',     'slug' => 'gudang',     'icon' => '🏭'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
