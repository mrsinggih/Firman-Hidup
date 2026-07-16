/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, X, Sparkles, Check, DollarSign } from "lucide-react";
import { MerchandiseItem } from "../types";

interface MerchandiseViewProps {
  merchandiseList: MerchandiseItem[];
  selectedItem: MerchandiseItem | null;
  onSelectItem: (item: MerchandiseItem | null) => void;
  onCheckout: (items: { id: string; quantity: number }[]) => Promise<{ success: boolean; totalPaid: number }>;
}

export default function MerchandiseView({
  merchandiseList,
  selectedItem,
  onSelectItem,
  onCheckout
}: MerchandiseViewProps) {
  // Simple Client-side Cart state
  const [cart, setCart] = useState<{ item: MerchandiseItem; quantity: number }[]>([]);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addToCart = (product: MerchandiseItem) => {
    if (product.stok <= 0) return;
    const existingIndex = cart.findIndex(c => c.item.id === product.id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= product.stok) {
        setErrorMessage(`Stok tidak mencukupi untuk menambah ${product.nama}`);
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { item: product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const idx = cart.findIndex(c => c.item.id === productId);
    if (idx === -1) return;
    const currentQty = cart[idx].quantity;
    const newQty = currentQty + delta;
    const storeItem = merchandiseList.find(m => m.id === productId);
    
    if (newQty <= 0) {
      removeFromCart(productId);
    } else if (storeItem && newQty > storeItem.stok) {
      setErrorMessage(`Stok terbatas! Hanya tersisa ${storeItem.stok} untuk ${storeItem.nama}`);
      setTimeout(() => setErrorMessage(""), 3000);
    } else {
      const updated = [...cart];
      updated[idx].quantity = newQty;
      setCart(updated);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(c => c.item.id !== productId));
  };

  const handleStoreCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const payload = cart.map(c => ({ id: c.item.id, quantity: c.quantity }));
      const result = await onCheckout(payload);
      
      if (result.success) {
        setCheckoutTotal(result.totalPaid);
        setIsCheckoutSuccess(true);
        setCart([]); // Clear cart
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses pembelian");
    } finally {
      setIsProcessing(false);
    }
  };

  const cartTotalAmount = cart.reduce((sum, c) => sum + c.item.harga * c.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 animate-fade-in" id="merchandise-view">
      {/* Product Display Panel */}
      <div className="lg:col-span-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 font-display">Toko Merchandise Kristen</h2>
          <p className="text-xs text-slate-500 mt-1">
            Beli cinderamata eksklusif bertemakan ayat-ayat firman Tuhan. Seluruh laba bersih disalurkan untuk mensponsori Donasi 1.000 Alkitab.
          </p>
        </div>

        {errorMessage && (
          <div id="store-error-alert" className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-2xl text-xs font-bold animate-pulse">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchandiseList.map(item => (
            <div
              id={`merch-card-${item.id}`}
              key={item.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div
                onClick={() => onSelectItem(item)}
                className="aspect-square relative overflow-hidden bg-slate-50 cursor-pointer"
              >
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {item.stok <= 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-extrabold uppercase">
                    Habis Terjual
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div onClick={() => onSelectItem(item)} className="cursor-pointer">
                  <h3 className="font-bold text-slate-800 text-sm font-display leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium">Harga</span>
                    <span className="text-base font-extrabold text-blue-600 font-display">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <button
                    id={`add-to-cart-btn-${item.id}`}
                    onClick={() => addToCart(item)}
                    disabled={item.stok <= 0}
                    className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 p-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                    title="Tambah ke Keranjang"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart & Billing Checkout Panel */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-6 sticky top-24" id="cart-sidebar">
          {isCheckoutSuccess ? (
            /* Thank you page */
            <div id="checkout-success-view" className="text-center py-8 space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Pembayaran Sukses</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Terima kasih sudah mendukung pelayanan kami! Tim administrasi kami akan segera mengemas merchandise pilihan Anda.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border text-xs text-slate-600 space-y-1 text-left">
                <p>Status: <strong className="text-green-600 uppercase">Lunas (Simulasi)</strong></p>
                <p>Total Dibayar: <strong className="text-slate-900 font-bold">Rp {checkoutTotal.toLocaleString("id-ID")}</strong></p>
                <p className="text-[10px] text-slate-400">Keuntungan 100% dikonversi menjadi Alkitab.</p>
              </div>
              <button
                id="cart-reset-btn"
                onClick={() => setIsCheckoutSuccess(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs"
              >
                Belanja Lagi
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center font-display">
                  <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
                  Keranjang Belanja
                </h3>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {cart.reduce((sum, c) => sum + c.quantity, 0)} Item
                </span>
              </div>

              {cart.length > 0 ? (
                /* Cart Items List */
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {cart.map(c => (
                    <div id={`cart-item-${c.item.id}`} key={c.item.id} className="flex gap-3 items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                        <img src={c.item.gambar} alt={c.item.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{c.item.nama}</h4>
                        <span className="text-[11px] text-blue-600 font-extrabold font-display">Rp {c.item.harga.toLocaleString("id-ID")}</span>
                        
                        {/* Quantity adjust buttons */}
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            id={`cart-qty-minus-${c.item.id}`}
                            onClick={() => updateQuantity(c.item.id, -1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-sm flex items-center justify-center transition-all"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-700">{c.quantity}</span>
                          <button
                            id={`cart-qty-plus-${c.item.id}`}
                            onClick={() => updateQuantity(c.item.id, 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-sm flex items-center justify-center transition-all"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        id={`cart-item-remove-${c.item.id}`}
                        onClick={() => removeFromCart(c.item.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingCart className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold">Keranjang Anda kosong</p>
                  <p className="text-[10px] text-slate-400">Pilihlah merchandise Kristen di sebelah kiri untuk menambah pesanan.</p>
                </div>
              )}

              {cart.length > 0 && (
                /* Billing Invoice Total & Checkout Simulation button */
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal Belanja</span>
                      <span>Rp {cartTotalAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimasi Ongkir (Simulasi)</span>
                      <span className="text-green-600 font-bold">GRATIS ONGKIR</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-800 pt-2 border-t border-dashed">
                      <span>Total Tagihan</span>
                      <span className="text-blue-600">Rp {cartTotalAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 text-blue-800 p-3.5 rounded-xl text-[10px] leading-normal flex items-start">
                    <Sparkles className="h-4 w-4 text-amber-500 mr-2 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>Pembelian ini setara dengan donasi <strong>{Math.floor(cartTotalAmount / 50000)} Alkitab saku</strong> untuk anak-anak pedalaman!</span>
                  </div>

                  <button
                    id="cart-checkout-submit-btn"
                    onClick={handleStoreCheckout}
                    disabled={isProcessing}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center cursor-pointer transition-all shadow-md shadow-slate-900/10"
                  >
                    {isProcessing ? "Menyelesaikan Pembelian..." : "Selesaikan & Bayar (Simulasi)"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <div id="product-detail-modal" className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative">
            <button
              id="product-detail-close-btn"
              onClick={() => onSelectItem(null)}
              className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-950/20 text-slate-700 p-2 rounded-full transition-all"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
              <img src={selectedItem.gambar} alt={selectedItem.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Merchandise
                </span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl font-display">{selectedItem.nama}</h3>
                <p className="text-blue-600 font-extrabold text-lg font-display mt-1">
                  Rp {selectedItem.harga.toLocaleString("id-ID")}
                </p>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                {selectedItem.deskripsi}
              </p>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl text-xs">
                <span className="text-slate-500">Stok Tersedia: <strong className="text-slate-800">{selectedItem.stok} unit</strong></span>
                <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Pemberian Alkitab Bersponsor</span>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    addToCart(selectedItem);
                    onSelectItem(null);
                  }}
                  disabled={selectedItem.stok <= 0}
                  className="flex-1 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
