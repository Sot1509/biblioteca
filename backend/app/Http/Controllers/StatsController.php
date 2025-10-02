<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(name="Stats", description="Estadísticas del sistema")
 */
class StatsController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/stats/overview",
     *   operationId="Stats_Overview",
     *   tags={"Stats"},
     *   summary="Resumen de estadísticas para el dashboard",
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(
     *         property="loansPerMonth",
     *         type="array",
     *         @OA\Items(
     *           type="object",
     *           @OA\Property(property="ym", type="string", example="2025-10"),
     *           @OA\Property(property="total", type="integer", example=12)
     *         )
     *       ),
     *       @OA\Property(
     *         property="availabilityPct",
     *         type="number",
     *         format="float",
     *         example=67.5
     *       ),
     *       @OA\Property(
     *         property="topUsers",
     *         type="array",
     *         @OA\Items(
     *           type="object",
     *           @OA\Property(property="user_id", type="integer", example=3),
     *           @OA\Property(property="total", type="integer", example=7),
     *           @OA\Property(
     *             property="user",
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=3),
     *             @OA\Property(property="name", type="string", example="Ana Pérez")
     *           )
     *         )
     *       ),
     *       @OA\Property(
     *         property="topBooks",
     *         type="array",
     *         @OA\Items(
     *           type="object",
     *           @OA\Property(property="book_id", type="integer", example=10),
     *           @OA\Property(property="total", type="integer", example=9),
     *           @OA\Property(
     *             property="book",
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=10),
     *             @OA\Property(property="title", type="string", example="Cien años de soledad")
     *           )
     *         )
     *       )
     *     )
     *   )
     * )
     */
    public function overview()
    {
        // Detecta el driver actual para usar la función de fecha correcta
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            $ymExpr = "strftime('%Y-%m', loan_date)";
        } elseif ($driver === 'pgsql') {
            $ymExpr = "to_char(loan_date, 'YYYY-MM')";
        } else { // mysql/mariadb
            $ymExpr = "DATE_FORMAT(loan_date, '%Y-%m')";
        }

        // Préstamos por mes
        $loansPerMonth = DB::table('loans')
            ->selectRaw("$ymExpr as ym, COUNT(*) as total")
            ->groupBy('ym')
            ->orderBy('ym')
            ->get();

        // Porcentaje de disponibilidad
        $sums = DB::table('books')
            ->selectRaw('COALESCE(SUM(total_copies),0) as total_copies, COALESCE(SUM(available_copies),0) as available_copies')
            ->first();

        $total = (int) ($sums->total_copies ?? 0);
        $avail = (int) ($sums->available_copies ?? 0);
        $availabilityPct = $total > 0 ? round(($avail / $total) * 100, 2) : 0;

        // Top usuarios y libros
        $topUsers = DB::table('loans')
            ->select('user_id', DB::raw('COUNT(*) as total'))
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $topBooks = DB::table('loans')
            ->select('book_id', DB::raw('COUNT(*) as total'))
            ->groupBy('book_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return response()->json([
            'loansPerMonth'   => $loansPerMonth,
            'availabilityPct' => $availabilityPct,
            'topUsers'        => $topUsers,
            'topBooks'        => $topBooks,
        ]);
    }
}
