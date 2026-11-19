<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'category_id', 'title', 'slug', 'description',
        'price', 'listing_type', 'status', 'address', 'city', 'province',
        'latitude', 'longitude', 'bedrooms', 'bathrooms',
        'land_area', 'building_area',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'latitude' => 'float',
        'longitude' => 'float',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'land_area' => 'integer',
        'building_area' => 'integer',
        'views_count' => 'integer',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Property $property) {
            if (empty($property->slug)) {
                $base = Str::slug($property->title);
                $slug = $base;
                $i = 1;
                while (static::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = $base.'-'.$i++;
                }
                $property->slug = $slug;
            }
        });
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $v) => $q->where(fn ($sub) => $sub->where('title', 'like', "%{$v}%")
                ->orWhere('city', 'like', "%{$v}%")
                ->orWhere('address', 'like', "%{$v}%")
            )
            )
            ->when($filters['category_id'] ?? null, fn ($q, $v) => $q->where('category_id', $v)
            )
            ->when($filters['listing_type'] ?? null, fn ($q, $v) => $q->where('listing_type', $v)
            )
            ->when($filters['city'] ?? null, fn ($q, $v) => $q->where('city', 'like', "%{$v}%")
            )
            ->when($filters['min_price'] ?? null, fn ($q, $v) => $q->where('price', '>=', $v)
            )
            ->when($filters['max_price'] ?? null, fn ($q, $v) => $q->where('price', '<=', $v)
            )
            ->when($filters['bedrooms'] ?? null, fn ($q, $v) => $q->where('bedrooms', '>=', $v)
            )
            ->when($filters['bathrooms'] ?? null, fn ($q, $v) => $q->where('bathrooms', '>=', $v)
            );
    }

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_primary', true);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}
