<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChildrenController extends Controller {

    public function store(Request $request){
        $validated = $request->validate([
            'name'=>'required|string',
            'birth_date'=>'required|date',
            'photo'=>'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'notes'=>'nullable|string'
        ]);

        if($request->hasFile('photo')){
            $validated['photo'] = $request->file('photo')->store('children','public');
        }

        $validated['created_by'] = $request->user()->id;

        $child = Child::create($validated);
        $child->photo_url = $child->photo ? asset('storage/'.$child->photo) : null;

        return response()->json($child,201);
    }

}
