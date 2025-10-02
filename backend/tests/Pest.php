<?php

use Tests\TestCase;

// Boot del kernel de Laravel para ambos directorios de tests:
uses(TestCase::class)->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/
expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/
function something()
{
    // helpers de prueba (si los necesitas)
}
