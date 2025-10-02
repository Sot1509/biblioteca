<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

/**
 * @OA\Tag(name="Users")
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/users",
     *   operationId="Users_Index",
     *   tags={"Users"},
     *   summary="Listar usuarios",
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function index()
    {
        return User::query()->latest()->paginate(10);
    }

    /**
     * @OA\Post(
     *   path="/api/users",
     *   operationId="Users_Store",
     *   tags={"Users"},
     *   summary="Crear usuario",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","email"},
     *       @OA\Property(property="name", type="string", example="Ada Lovelace"),
     *       @OA\Property(property="email", type="string", format="email", example="ada@example.com"),
     *       @OA\Property(property="password", type="string", example="secret123")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Creado", @OA\JsonContent(ref="#/components/schemas/User")),
     *   @OA\Response(response=422, description="Validación")
     * )
     */
    public function store(StoreUserRequest $r)
    {
        $data = $r->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        return response()->json(User::create($data), 201);
    }

    /**
     * @OA\Put(
     *   path="/api/users/{id}",
     *   operationId="Users_Update",
     *   tags={"Users"},
     *   summary="Actualizar usuario",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="name", type="string"),
     *       @OA\Property(property="email", type="string", format="email"),
     *       @OA\Property(property="password", type="string")
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/User")),
     *   @OA\Response(response=404, description="No encontrado")
     * )
     */
    public function update(UpdateUserRequest $r, User $user)
    {
        $data = $r->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);
        return $user;
    }

    /**
     * @OA\Delete(
     *   path="/api/users/{id}",
     *   operationId="Users_Destroy",
     *   tags={"Users"},
     *   summary="Eliminar usuario",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Sin contenido"),
     *   @OA\Response(response=404, description="No encontrado")
     * )
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }
}
