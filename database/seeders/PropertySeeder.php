<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $agent = User::where('email', 'agen@propspace.id')->first();
        $categories = Category::all()->keyBy('slug');

        $properties = [
            [
                'title' => 'Rumah Minimalis Modern di Kebayoran',
                'description' => 'Rumah 2 lantai dengan desain modern minimalis, lokasi strategis dekat MRT, lingkungan aman dan asri.',
                'price' => 1850000000,
                'listing_type' => 'sell',
                'category_id' => $categories['rumah']->id,
                'address' => 'Jl. Kebayoran Baru No. 12',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'latitude' => -6.2297,
                'longitude' => 106.7984,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'land_area' => 120,
                'building_area' => 180,
                'status' => 'approved',
            ],
            [
                'title' => 'Apartemen Studio Sudirman CBD',
                'description' => 'Unit studio siap huni di pusat bisnis Sudirman. Fasilitas lengkap, kolam renang, gym.',
                'price' => 850000000,
                'listing_type' => 'sell',
                'category_id' => $categories['apartemen']->id,
                'address' => 'Jl. Jend. Sudirman Kav. 54',
                'city' => 'Jakarta Pusat',
                'province' => 'DKI Jakarta',
                'latitude' => -6.2088,
                'longitude' => 106.8116,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'land_area' => 0,
                'building_area' => 35,
                'status' => 'approved',
            ],
            [
                'title' => 'Tanah Kavling Strategis Depok',
                'description' => 'Tanah kavling siap bangun, akses jalan 8 meter, dekat tol Desari.',
                'price' => 650000000,
                'listing_type' => 'sell',
                'category_id' => $categories['tanah']->id,
                'address' => 'Jl. Raya Cinere No. 88',
                'city' => 'Depok',
                'province' => 'Jawa Barat',
                'latitude' => -6.3728,
                'longitude' => 106.8272,
                'bedrooms' => 0,
                'bathrooms' => 0,
                'land_area' => 200,
                'building_area' => 0,
                'status' => 'approved',
            ],
            [
                'title' => 'Villa Mewah Puncak dengan Kolam Renang',
                'description' => 'Villa eksklusif di Puncak dengan pemandangan pegunungan, kolam renang pribadi, cocok untuk investasi wisata.',
                'price' => 15000000,
                'listing_type' => 'rent',
                'category_id' => $categories['villa']->id,
                'address' => 'Jl. Raya Puncak KM 85',
                'city' => 'Bogor',
                'province' => 'Jawa Barat',
                'latitude' => -6.7008,
                'longitude' => 106.9972,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'land_area' => 500,
                'building_area' => 350,
                'status' => 'approved',
            ],
            [
                'title' => 'Ruko 3 Lantai Lokasi Premium BSD',
                'description' => 'Ruko strategis di kawasan bisnis BSD, cocok untuk showroom, kantor, atau retail.',
                'price' => 3200000000,
                'listing_type' => 'sell',
                'category_id' => $categories['ruko']->id,
                'address' => 'BSD City Blok B2 No. 5',
                'city' => 'Tangerang Selatan',
                'province' => 'Banten',
                'latitude' => -6.3006,
                'longitude' => 106.6527,
                'bedrooms' => 0,
                'bathrooms' => 2,
                'land_area' => 72,
                'building_area' => 216,
                'status' => 'approved',
            ],
            [
                'title' => 'Rumah Cluster Gading Serpong',
                'description' => 'Rumah dalam cluster one gate system, 2 kamar tidur, carport 2 mobil, kondisi terawat.',
                'price' => 980000000,
                'listing_type' => 'sell',
                'category_id' => $categories['rumah']->id,
                'address' => 'Cluster Lavender Blok C3 No. 8',
                'city' => 'Tangerang',
                'province' => 'Banten',
                'latitude' => -6.2401,
                'longitude' => 106.6228,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'land_area' => 90,
                'building_area' => 110,
                'status' => 'approved',
            ],
        ];

        foreach ($properties as $data) {
            Property::firstOrCreate(
                ['title' => $data['title']],
                array_merge($data, ['user_id' => $agent->id])
            );
        }
    }
}
