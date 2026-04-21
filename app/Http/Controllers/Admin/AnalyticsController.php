<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/analytics', [
            'revenue_by_month' => $this->groupByMonth('invoices', 'paid_at', 'sum(amount_php)', [
                ['status', InvoiceStatus::Paid->value],
            ]),
            'new_customers_by_month' => $this->newCustomersByMonth(),
        ]);
    }

    /**
     * Group rows by year-month using a DB-portable expression.
     *
     * @param  array<int, array{0:string,1:string}>  $where
     */
    protected function groupByMonth(string $table, string $column, string $aggregate, array $where = []): Collection
    {
        $expr = $this->yearMonthExpression($column);
        $alias = $aggregate === 'count(*)' ? 'count' : 'total';

        $query = DB::table($table)
            ->selectRaw("$expr as month, $aggregate as $alias")
            ->where($column, '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month');

        foreach ($where as [$col, $val]) {
            $query->where($col, $val);
        }

        return new Collection($query->get()->all());
    }

    protected function newCustomersByMonth(): Collection
    {
        $expr = $this->yearMonthExpression('users.created_at');

        return new Collection(
            User::role('customer')
                ->where('users.created_at', '>=', now()->subMonths(11)->startOfMonth())
                ->selectRaw("$expr as month, count(*) as count")
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->all(),
        );
    }

    /**
     * Returns a SQL expression that yields YYYY-MM for the given column,
     * portable across SQLite and MySQL.
     */
    protected function yearMonthExpression(string $column): string
    {
        $driver = DB::connection()->getDriverName();

        return match ($driver) {
            'mysql', 'mariadb' => "DATE_FORMAT($column, '%Y-%m')",
            'pgsql' => "TO_CHAR($column, 'YYYY-MM')",
            default => "strftime('%Y-%m', $column)", // sqlite
        };
    }
}
