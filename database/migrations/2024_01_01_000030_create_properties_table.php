<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 15, 2);
            $table->enum('listing_type', ['sell', 'rent'])->default('sell');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('address');
            $table->string('city');
            $table->string('province');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->integer('land_area')->default(0);
            $table->integer('building_area')->default(0);
            $table->integer('views_count')->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->index('price');
            $table->index('city');
            $table->index('status');
            $table->index('listing_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
