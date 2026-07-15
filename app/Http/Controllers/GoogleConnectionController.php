<?php

namespace App\Http\Controllers;

use App\Actions\Auth\UnlinkGoogleAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GoogleConnectionController extends Controller
{
    public function destroy(Request $request, UnlinkGoogleAccount $unlinkGoogleAccount): RedirectResponse
    {
        try {
            $unlinkGoogleAccount->handle($request->user());
        } catch (ValidationException $e) {
            return redirect()->route('profile.edit')->withErrors($e->errors());
        }

        return redirect()->route('profile.edit')->with('status', 'google-disconnected');
    }
}
