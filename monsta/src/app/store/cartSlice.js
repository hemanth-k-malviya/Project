import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const COOKIE_KEY = 'cart';

const calculateTotals = (items) => {
  return items.reduce(
    (acc, item) => {
      acc.totalQuantity += item.quantity;
      acc.totalAmount += item.quantity * (Number(item.sale_price) || 0);
      return acc;
    },
    { totalQuantity: 0, totalAmount: 0 }
  );
};

const loadInitialState = () => {
  try {
    const stored = Cookies.get(COOKIE_KEY);
    if (!stored) {
      return {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };
    }
    const totals = calculateTotals(parsed);
    return {
      items: parsed,
      ...totals,
    };
  } catch {
    return {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }
};

const saveToCookies = (items) => {
  try {
    Cookies.set(COOKIE_KEY, JSON.stringify(items), { expires: 7 });
  } catch {
    // ignore cookie write errors
  }
};

let saveTimeout = null;
const debouncedSaveToCookies = (items) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    saveToCookies(items);
  }, 300);
};

const rehydrateFromCookie = () => {
  const loaded = loadInitialState();
  return {
    type: 'cart/rehydrate',
    payload: loaded,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadInitialState(),
  reducers: {
    rehydrate(state, action) {
      if (!action.payload) return;
      state.items = action.payload.items ?? state.items;
      state.totalQuantity = action.payload.totalQuantity ?? 0;
      state.totalAmount = action.payload.totalAmount ?? 0;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      if (!product) return;
      const id = product._id || product.id;
      if (!id) return;

      const existing = state.items.find((item) => (item._id || item.id) === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          _id: id,
          id,
          name: product.name,
          actual_price: product.actual_price,
          sale_price: product.sale_price,
          image: product.image,
          parent_category: product.parent_category,
          sub_category: product.sub_category?.name
            ? { name: product.sub_category.name }
            : product.sub_category ?? null,
          imagePath: product.imagePath || product.image_path || null,
          quantity: 1,
          dimension: product.dimension || '',
        });
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      debouncedSaveToCookies(state.items);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      if (!id) return;

      state.items = state.items.filter((item) => (item._id || item.id) !== id);
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      debouncedSaveToCookies(state.items);
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      if (!id) return;

      const existing = state.items.find((item) => (item._id || item.id) === id);
      if (!existing) return;

      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((item) => (item._id || item.id) !== id);
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      debouncedSaveToCookies(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = null;
      saveToCookies(state.items);
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart, rehydrate } = cartSlice.actions;
export { rehydrateFromCookie };
export default cartSlice.reducer;


