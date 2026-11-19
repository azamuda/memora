<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PropertyImage extends Model
{
    protected $fillable = ['property_id', 'image_path', 'is_primary', 'sort_order'];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['image_url'];

    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (PropertyImage $image) {
            Storage::disk('public')->delete($image->image_path);
        });
    }

    public function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
