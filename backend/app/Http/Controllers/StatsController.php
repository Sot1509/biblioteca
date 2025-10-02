<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function overview() {
    $loansPerMonth = Loan::selectRaw("DATE_FORMAT(loan_date,'%Y-%m') as ym, COUNT(*) as total")
      ->groupBy('ym')->orderBy('ym','asc')->get();

    $topBooks = Loan::selectRaw('book_id, COUNT(*) as total')
      ->groupBy('book_id')->orderByDesc('total')->with('book:id,title')->limit(5)->get();

    $totalCopies = Book::sum('total_copies');

    $available    = Book::sum('available_copies');
    
    $availabilityPct = $totalCopies ? round($available*100/$totalCopies,2) : 0;

    $topUsers = Loan::selectRaw('user_id, COUNT(*) as total')
      ->where('status','active')->groupBy('user_id')->orderByDesc('total')
      ->with('user:id,name')->limit(5)->get();

    return compact('loansPerMonth','topBooks','availabilityPct','topUsers');
  }
}
