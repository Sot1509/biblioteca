<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Throwable;

class Handler extends \Illuminate\Foundation\Exceptions\Handler
{
    public function register(): void
    {
        $this->renderable(function (Throwable $e, $request) {
            
            if (! $request->is('api/*')) {
                return null;
            }

            $debug = (bool) config('app.debug');
            $status = 500;
            $error  = class_basename($e);
            $message = $debug ? ($e->getMessage() ?: 'Error interno') : 'Error interno';

            // 422: validación
            if ($e instanceof ValidationException) {
                return response()->json([
                    'ok'     => false,
                    'error'  => 'ValidationException',
                    'message'=> 'Datos inválidos',
                    'fields' => $e->errors(),
                    'status' => 422,
                ], 422);
            }

            // 404: no encontrado (model binding) o ruta
            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json([
                    'ok'     => false,
                    'error'  => 'NotFound',
                    'message'=> 'Recurso no encontrado',
                    'status' => 404,
                ], 404);
            }

            // 405: método no permitido
            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'ok'     => false,
                    'error'  => 'MethodNotAllowed',
                    'message'=> 'Método no permitido',
                    'status' => 405,
                ], 405);
            }

            // 401 / 403 / 429
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'ok'     => false,
                    'error'  => 'Unauthenticated',
                    'message'=> 'No autenticado',
                    'status' => 401,
                ], 401);
            }

            if ($e instanceof AuthorizationException) {
                return response()->json([
                    'ok'     => false,
                    'error'  => 'Forbidden',
                    'message'=> 'No autorizado',
                    'status' => 403,
                ], 403);
            }

            if ($e instanceof ThrottleRequestsException) {
                return response()->json([
                    'ok'     => false,
                    'error'  => 'TooManyRequests',
                    'message'=> 'Demasiadas solicitudes',
                    'status' => 429,
                ], 429);
            }

            
            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
            }

            
            if ($e instanceof QueryException && ! $debug) {
                $message = 'Error de base de datos';
            }

            $payload = [
                'ok'      => false,
                'error'   => $error,
                'message' => $message,
                'status'  => $status,
            ];

            
            if ($debug) {
                $payload['trace'] = collect($e->getTrace())->take(5); // recorta para no saturar
            }

            return response()->json($payload, $status);
        });
    }
}
