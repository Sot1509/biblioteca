<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Http\Requests\StoreLoanRequest;
use App\Services\LoanService;

/**
 * @OA\Tag(name="Loans")
 */
class LoanController extends Controller
{
    public function __construct(private LoanService $service) {}

    /**
     * @OA\Get(
     *   path="/api/loans",
     *   operationId="Loans_Index",
     *   tags={"Loans"},
     *   summary="Listar préstamos",
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function index(\Illuminate\Http\Request $r)
{
    $per = (int) $r->integer('per_page', 10);
    return \App\Models\Loan::with(['user','book'])->latest()->paginate($per);
}

    /**
     * @OA\Post(
     *   path="/api/loans",
     *   operationId="Loans_Store",
     *   tags={"Loans"},
     *   summary="Crear préstamo",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"user_id","book_id","loan_date","due_date"},
     *       @OA\Property(property="user_id", type="integer", example=1),
     *       @OA\Property(property="book_id", type="integer", example=10),
     *       @OA\Property(property="loan_date", type="string", format="date", example="2025-10-01"),
     *       @OA\Property(property="due_date", type="string", format="date", example="2025-10-08")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Creado", @OA\JsonContent(ref="#/components/schemas/Loan")),
     *   @OA\Response(response=422, description="Validación")
     * )
     */
    public function store(StoreLoanRequest $r)
    {
        $d = $r->validated();
        $loan = $this->service->createLoan($d['user_id'], $d['book_id'], $d['loan_date'], $d['due_date']);
        return response()->json($loan->load(['user','book']), 201);
    }

    /**
     * @OA\Post(
     *   path="/api/loans/{id}/return",
     *   operationId="Loans_Return",
     *   tags={"Loans"},
     *   summary="Devolver préstamo",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Loan")),
     *   @OA\Response(response=404, description="No encontrado")
     * )
     */
    public function return(Loan $loan)
    {
        $loan = $this->service->returnLoan($loan);
        return $loan->load(['user','book']);
    }
}
