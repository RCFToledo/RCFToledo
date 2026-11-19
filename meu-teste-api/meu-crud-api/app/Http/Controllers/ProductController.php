<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    // POST /api/products
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    // GET /api/products/{product}
    public function show(Product $product)
    {
        return response()->json($product, 200);
    }

    // PUT/PATCH /api/products/{product}
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
        ]);

        $product->update($validated);
        return response()->json($product, 200);
    }

    // DELETE /api/products/{product}
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}