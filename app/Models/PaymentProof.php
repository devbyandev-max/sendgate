<?php

namespace App\Models;

use App\Enums\PaymentProofStatus;
use Database\Factories\PaymentProofFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'invoice_id',
    'user_id',
    'file_path',
    'amount_claimed',
    'reference_number',
    'bank_name',
    'uploaded_at',
    'reviewed_by',
    'reviewed_at',
    'status',
    'admin_notes',
])]
class PaymentProof extends Model
{
    /** @use HasFactory<PaymentProofFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount_claimed' => 'decimal:2',
            'uploaded_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'status' => PaymentProofStatus::class,
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
