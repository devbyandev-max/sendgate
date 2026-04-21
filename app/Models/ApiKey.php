<?php

namespace App\Models;

use App\Enums\ApiKeyStatus;
use Database\Factories\ApiKeyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'user_id',
    'name',
    'key_prefix',
    'key_hash',
    'last_used_at',
    'expires_at',
    'scopes',
    'status',
])]
class ApiKey extends Model
{
    /** @use HasFactory<ApiKeyFactory> */
    use HasFactory;

    public ?string $plaintext = null;

    protected function casts(): array
    {
        return [
            'scopes' => 'array',
            'status' => ApiKeyStatus::class,
            'last_used_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ApiKeyStatus::Active);
    }

    public static function generate(User $user, string $name, ?array $scopes = null): self
    {
        $prefix = 'sg_live_'.Str::random(8);
        $plaintext = $prefix.'_'.Str::random(32);

        $model = self::create([
            'user_id' => $user->id,
            'name' => $name,
            'key_prefix' => $prefix,
            'key_hash' => hash('sha256', $plaintext),
            'scopes' => $scopes,
            'status' => ApiKeyStatus::Active,
        ]);

        $model->plaintext = $plaintext;

        return $model;
    }

    public static function findByPlaintext(string $key): ?self
    {
        return self::where('key_hash', hash('sha256', $key))
            ->where('status', ApiKeyStatus::Active)
            ->first();
    }
}
