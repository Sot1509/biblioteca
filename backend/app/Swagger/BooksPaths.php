<?php

namespace App\Swagger;

class BooksPaths
{
    /**
     * @OA\Tag(name="Books")
     */

    /**
     * @OA\Get(
     *   path="/api/books",
     *   operationId="Books_Index",
     *   tags={"Books"},
     *   summary="Listar libros",
     *   @OA\Response(
     *     response=200,
     *     description="OK",
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Book"))
     *     )
     *   )
     * )
     */

    /**
     * @OA\Post(
     *   path="/api/books",
     *   operationId="Books_Store",
     *   tags={"Books"},
     *   summary="Crear libro",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"title","author","total_copies","available_copies"},
     *       @OA\Property(property="title", type="string"),
     *       @OA\Property(property="author", type="string"),
     *       @OA\Property(property="genre", type="string"),
     *       @OA\Property(property="total_copies", type="integer"),
     *       @OA\Property(property="available_copies", type="integer")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Creado", @OA\JsonContent(ref="#/components/schemas/Book")),
     *   @OA\Response(response=422, description="Validación")
     * )
     */

    /**
     * @OA\Get(
     *   path="/api/books/{id}",
     *   operationId="Books_Show",
     *   tags={"Books"},
     *   summary="Obtener libro",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Book")),
     *   @OA\Response(response=404, description="No encontrado")
     * )
     */

    /**
     * @OA\Put(
     *   path="/api/books/{id}",
     *   operationId="Books_Update",
     *   tags={"Books"},
     *   summary="Actualizar libro",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="title", type="string"),
     *       @OA\Property(property="author", type="string"),
     *       @OA\Property(property="genre", type="string"),
     *       @OA\Property(property="total_copies", type="integer"),
     *       @OA\Property(property="available_copies", type="integer")
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Book")),
     *   @OA\Response(response=404, description="No encontrado")
     * )
     */

    /**
     * @OA\Delete(
     *   path="/api/books/{id}",
     *   operationId="Books_Destroy",
     *   tags={"Books"},
     *   summary="Eliminar libro",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Sin contenido"),
     *   @OA\Response(response=404, description="No encontrado")
     * )
     */
}
