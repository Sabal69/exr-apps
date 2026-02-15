import { products } from "../data/products";
import { Link } from "react-router-dom";

export default function Products() {
    return (
        <div className="min-h-screen bg-black text-white p-12">
            <h1 className="text-4xl mb-10 tracking-widest">PRODUCTS</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {products.map((p) => (
                    <div key={p.id} className="border border-white p-4">
                        <div className="h-56 bg-gray-800 flex items-center justify-center">
                            PRODUCT IMAGE
                        </div>

                        <h2 className="mt-4 text-lg">{p.name}</h2>
                        <p className="opacity-70">${p.price}</p>

                        <Link to={`/product/${p.id}`}>
                            <button className="mt-4 w-full border border-white text-white py-2 uppercase hover:bg-white hover:text-black transition">
                                View
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}