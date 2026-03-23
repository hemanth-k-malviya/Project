'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { CiHeart } from 'react-icons/ci';
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { addToCart } from '../store/cartSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const dispatch = useDispatch();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [category, setCategory] = useState([])
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterSubCategories, setFilterSubCategories] = useState([]);
  const [material, setMaterial] = useState([]);
  const [color, setColor] = useState([]);
  const [filterMaterial, setFilterMaterial] = useState([]);
  const [filterColors, setFilterColors] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('default'); // 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryGroups = React.useMemo(() => {
    const source =
      Array.isArray(category) && category.length > 0
        ? category
        : (Array.isArray(products) ? products : []);

    const parentMap = new Map();

    source.forEach((item) => {
      const parent = item?.parent_category;
      const sub = item?.sub_category;

      const parentId = parent?._id || parent;
      const parentName = parent?.name;
      const subId = sub?._id || sub;
      const subName = sub?.name;

      if (!parentId) return;

      if (!parentMap.has(parentId)) {
        parentMap.set(parentId, {
          parentId,
          parentName: parentName || 'Category',
          subsMap: new Map(),
        });
      }

      if (subId) {
        parentMap.get(parentId).subsMap.set(subId, {
          _id: subId,
          name: subName || 'Sub Category',
        });
      }
    });

    return Array.from(parentMap.values()).map((g) => ({
      parentId: g.parentId,
      parentName: g.parentName,
      subs: Array.from(g.subsMap.values()),
    }));
  }, [category, products]);

  const baseUrl = (process.env.NEXT_PUBLIC_APIS_URL)
  if (!baseUrl) return;

  useEffect(() => {
    axios.post(`${baseUrl}/products/view`, {
      page: currentPage,
      parent_category: filterCategories.toString(),
      sub_category_ids: filterSubCategories,
    })
      .then((result) => {
        if (result.data._status === true) {
          setProducts(result.data._data ? result.data._data : []);
          setImageUrl(result.data.image_path || '');
          setTotalPage(result.data._paginate?.total_page || 1);
        } else {
          setProducts([]);
          setTotalPage(1);
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!');
        setProducts([]);
      })
  }, [currentPage, filterCategories, filterSubCategories])

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const res = await axios.post(`${baseUrl}/sub-sub-categorys/view`, {
          page: 1,
          limit: 500,
        });
        const data = res?.data;
        if (!cancelled && data?._status && Array.isArray(data._data)) {
          setCategory(data._data);
        } else if (!cancelled) {
          setCategory([]);
        }
      } catch {
        if (!cancelled) setCategory([]);
      }
    };

    fetchCategories();
    return () => { cancelled = true; };
  }, [baseUrl]);

  useEffect(() => {
    try {
      const user = Cookies.get('user_login');
      const loggedIn = !!user;
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        setWishlistIds([]);
        return;
      }
      const stored = Cookies.get('wishlist');
      const parsed = stored ? JSON.parse(stored) : [];
      const ids = Array.isArray(parsed) ? parsed.map((item) => item._id || item.id) : [];
      setWishlistIds(ids);
    } catch {
      setWishlistIds([]);
      setIsLoggedIn(false);
    }
  }, []);


  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addToCart({ ...product, imagePath: imageUrl }));
    toast.success('Added to cart');
    // router.push('/checkout');
  };

  const handleAddToWishlist = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    try {

      if (!isLoggedIn) {
        toast.info('Please login to use wishlist');
        return;
      }
      const productId = product._id || product.id;
      const stored = Cookies.get('wishlist');
      const wishlist = stored ? JSON.parse(stored) : [];
      const exists = Array.isArray(wishlist) && wishlist.some((item) => (item._id || item.id) === productId);

      if (exists) {
        toast.info('Product already in wishlist');
        return;
      }
      const newItem = {
        _id: productId,
        name: product.name,
        actual_price: product.actual_price,
        sale_price: product.sale_price,
        image: product.image,
        sub_category: product.sub_category?.name ? { name: product.sub_category.name } : null,
        imagePath: imageUrl,
      };

      const updated = Array.isArray(wishlist) ? [...wishlist, newItem] : [newItem];
      Cookies.set('wishlist', JSON.stringify(updated), { expires: 7 });
      setWishlistIds(updated.map((item) => item._id || item.id));
      toast.success('Added to wishlist');
    } catch (e) {
      console.error('Failed to update wishlist', e);
      toast.error('Failed to update wishlist');
    }
  };

  const filterSubCategory = (slug) => {
    if (filterSubCategories.includes(slug)) {
      const data = filterSubCategories.filter((v) => v !== slug);
      setFilterSubCategories(data);
    } else {
      const data = [...filterSubCategories, slug];
      setFilterSubCategories(data);
    }
    setCurrentPage(1);
  }

  const filteMaterials = (id) => {
    if (filterMaterial.includes(id)) {
      const data = filterMaterial.filter((v) => v !== id);
      setFilterMaterial(data);
    } else {
      const data = [...filterMaterial, id];
      setFilterMaterial(data);
    }
    setCurrentPage(1);
  };

  const handleFilterColors = (id) => {
    if (filterColors.includes(id)) {
      const data = filterColors.filter((v) => v !== id);
      setFilterColors(data);
    } else {
      const data = [...filterColors, id];
      setFilterColors(data);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    axios.post(`${baseUrl}/material/view`)
      .then((result) => {
        if (result.data._status == true) {
          setMaterial(result.data._data);
        } else {
          setMaterial([])
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!')
      })
  }, [])

  useEffect(() => {
    axios.post(`${baseUrl}/color/view`)
      .then((result) => {
        if (result.data._status == true) {
          setColor(result.data._data);
        } else {
          setColor([])
        }
      })
      .catch(() => {
        toast.error('Something went wrong !!')
      })
  }, [])

  const displayedProducts = React.useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    if (filterMaterial.length > 0) {
      result = result.filter((p) => {
        if (Array.isArray(p?.material_ids)) {
          const ids = p.material_ids.map((m) => m?._id || m).filter(Boolean);
          return ids.some((id) => filterMaterial.includes(id));
        }
        const singleId = p?.material_ids?._id || p?.material_ids;
        return singleId ? filterMaterial.includes(singleId) : false;
      });
    }

    if (filterColors.length > 0) {
      result = result.filter((p) => {
        if (Array.isArray(p?.color_ids)) {
          const ids = p.color_ids.map((c) => c?._id || c).filter(Boolean);
          return ids.some((id) => filterColors.includes(id));
        }
        const singleId = p?.color_ids?._id || p?.color_ids;
        return singleId ? filterColors.includes(singleId) : false;
      });
    }

    if (minPrice !== 0 || maxPrice !== 200000) {
      result = result.filter((p) => {
        const price = Number(p?.sale_price ?? p?.actual_price ?? 0);
        if (Number.isNaN(price)) return false;
        return price >= minPrice && price <= maxPrice;
      });
    }

    if (sortBy !== 'default') {
      result.sort((a, b) => {
        const priceA = Number(a?.sale_price ?? a?.actual_price ?? 0);
        const priceB = Number(b?.sale_price ?? b?.actual_price ?? 0);
        const nameA = (a?.name || '').toString().toLowerCase();
        const nameB = (b?.name || '').toString().toLowerCase();

        switch (sortBy) {
          case 'price_asc':
            return priceA - priceB;
          case 'price_desc':
            return priceB - priceA;
          case 'name_asc':
            return nameA.localeCompare(nameB);
          case 'name_desc':
            return nameB.localeCompare(nameA);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [products, filterMaterial, filterColors, minPrice, maxPrice, sortBy]);

  return (
    <>
      <div className="max-w-[1280px] w-full mx-auto my-1 px-4">
        <p className='text-[28px] sm:text-[34px] md:text-[40px] font-bold text-center'>Product Listing</p>
        <div className='flex justify-center' >
          <Link href={'/'}> <p className="text-[16px] hover:text-[#C09578]"> Home </p></Link>
          <p className="text-[16px] text-[#C09578] px-1"><IoIosArrowForward className='mt-1.5' /></p>
          <p className="text-[16px] text-[#C09578]">Product Listing</p>
        </div>

        {/* border */}
        <div className='border border-gray-200 m-8'></div>

        {isFilterOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[85vw] max-w-[360px] bg-white shadow-lg overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <p className="font-bold text-gray-800">Filters</p>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:border-[#C09578] hover:text-[#C09578] transition-colors font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="p-3 sm:p-4">
                <div className="overflow-visible lg:overflow-y-auto lg:max-h-[70vh]">
                  <p className='text-[18px] sm:text-[22px] font-bold text-center my-4'>Categories</p>

                  {/* Tables */}
                  {categoryGroups.map((group) => (
                    <div key={group.parentId} className="mb-4">
                      <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>
                        {group.parentName}
                      </p>
                      {group.subs.map((sub) => (
                        <div key={sub._id} className="flex items-center mb-2 gap-2">
                          <input
                            id={sub._id}
                            checked={filterSubCategories.includes(sub._id)}
                            onChange={() => filterSubCategory(sub._id)}
                            type="checkbox"
                            className='w-4 h-4 cursor-pointer'
                          />
                          <p className='text-[14px] sm:text-[15px] text-gray-600 cursor-pointer hover:text-[#C09578]'>
                            {sub.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Material */}
                <div className="mb-4">
                  <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>Material</p>

                  {material.length > 0 &&
                    material.map((v) => (
                      <div key={v._id} className="flex items-center mb-2 gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={filterMaterial.includes(v._id)}
                          onChange={() => filteMaterials(v._id)}
                        />
                        <p className="text-[14px] sm:text-[15px] text-gray-600 cursor-pointer hover:text-[#C09578]">
                          {v.name}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Color */}
                <div className="mb-4">
                  <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>Color</p>
                  {color.length > 0 &&
                    color.map((v) => (
                      <div key={v._id} className="flex items-center mb-2 gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={filterColors.includes(v._id)}
                          onChange={() => handleFilterColors(v._id)}
                        />
                        <p className="text-[14px] sm:text-[15px] text-gray-600 cursor-pointer hover:text-[#C09578]">
                          {v.name}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Filter by price */}
                <div className="mb-4">
                  <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>Filter by Price</p>
                  <div className="px-0 sm:px-2">
                    <div className="mb-3">
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C09578]'
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <label className='text-[12px] text-gray-500 mb-1 block'>Min Price</label>
                        <input
                          type="number"
                          min="0"
                          max={maxPrice}
                          value={minPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setMinPrice(val < 0 ? 0 : val > maxPrice ? maxPrice : val);
                          }}
                          className='w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#C09578]'
                        />
                      </div>
                      <div className="flex-1">
                        <label className='text-[12px] text-gray-500 mb-1 block'>Max Price</label>
                        <input
                          type="number"
                          min={minPrice}
                          max="200000"
                          value={maxPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            const clamped = val < minPrice ? minPrice : val > 200000 ? 200000 : val;
                            setMaxPrice(clamped);
                          }}
                          className='w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#C09578]'
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className='w-full bg-[#C09578] hover:bg-[#ad8060] text-white rounded px-4 py-2 text-sm transition-colors'
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[25%_75%] grid-cols-1 gap-6 my-8">
          {/* Sidebar - Categories */}
          <div className="hidden lg:block p-3 sm:p-4 min-w-0 w-full">
            <div className="overflow-visible lg:overflow-y-auto lg:max-h-[70vh]">
              <p className='text-[18px] sm:text-[22px] font-bold text-center my-4'>Categories</p>

              {/* Tables */}
              {categoryGroups.map((group) => (
                <div key={group.parentId} className="mb-4">
                  <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>
                    {group.parentName}
                  </p>
                  {group.subs.map((sub) => (
                    <div key={sub._id} className="flex items-center mb-2 gap-2">
                      <input
                        id={sub._id}
                        checked={filterSubCategories.includes(sub._id)}
                        onChange={() => filterSubCategory(sub._id)}
                        type="checkbox"
                        className='w-4 h-4 cursor-pointer'
                      />
                      <p className='text-[14px] sm:text-[15px] text-gray-600 cursor-pointer hover:text-[#C09578]'>
                        {sub.name}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Material */}
            <div className="mb-4">
              <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>Material</p>

              {material.length > 0 &&
                material.map((v) => (
                  <div key={v._id} className="flex items-center mb-2 gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={filterMaterial.includes(v._id)}
                      onChange={() => filteMaterials(v._id)}
                    />
                    <p className="text-[14px] sm:text-[15px] text-gray-600 cursor-pointer hover:text-[#C09578]">
                      {v.name}
                    </p>
                  </div>
                ))}

            </div>

            {/* Color */}
            <div className="mb-4">
              <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>Color</p>
              {color.length > 0 &&
                color.map((v) => (
                  <div key={v._id} className="flex items-center mb-2 gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={filterColors.includes(v._id)}
                      onChange={() => handleFilterColors(v._id)}
                    />
                    <p className="text-[14px] sm:text-[15px] text-gray-600 cursor-pointer hover:text-[#C09578]">
                      {v.name}
                    </p>
                  </div>
                ))}

            </div>

            {/* Filter by price */}
            <div className="mb-4">
              <p className='text-[16px] sm:text-[18px] font-bold text-gray-700 my-3'>Filter by Price</p>
              <div className="px-0 sm:px-2">
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C09578]'
                  />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <label className='text-[12px] text-gray-500 mb-1 block'>Min Price</label>
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={minPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setMinPrice(val < 0 ? 0 : val > maxPrice ? maxPrice : val);
                      }}
                      className='w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#C09578]'
                    />
                  </div>
                  <div className="flex-1">
                    <label className='text-[12px] text-gray-500 mb-1 block'>Max Price</label>
                    <input
                      type="number"
                      min={minPrice}
                      max="200000"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        const clamped = val < minPrice ? minPrice : val > 200000 ? 200000 : val;
                        setMaxPrice(clamped);
                      }}
                      className='w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#C09578]'
                    />
                  </div>
                </div>
                <button
                  type="button"
                    onClick={() => {
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
                  className='w-full bg-[#C09578] hover:bg-[#ad8060] text-white rounded px-4 py-2 text-sm transition-colors'
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className=" p-4">
            <div className="mb-4 ">
              <div className="flex justify-between items-center mb-4 mt-4">
                <p className='text-[24px] font-bold'>Products</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="lg:hidden px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:border-[#C09578] hover:text-[#C09578] transition-colors"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    Filter
                  </button>

                  <div className="hidden sm:flex items-center gap-2">
                    <select
                      className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#C09578]"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Sort by: Default</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-visible lg:overflow-y-auto lg:max-h-[70vh]">
              <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                {
                  displayedProducts.length > 0
                    ?
                    displayedProducts.map((v, i) => {
                      const productId = v._id || v.id;
                      const isInWishlist = wishlistIds.includes(productId);
                      return (
                        <div
                          key={productId || i}
                          className="w-full border border-gray-200 rounded shadow-lg hover:shadow-xl transition-shadow mt-2 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col"
                        >
                          <Link href={`/products-details/${productId}`}>
                            {v.image
                              ? <img className='w-full h-[160px] sm:h-[190px] lg:h-[200px] object-cover' alt={v.name || 'Product'} src={`${imageUrl}${v.image}`} />
                              : <div className="w-full h-[160px] sm:h-[190px] lg:h-[200px] bg-gray-100 flex items-center justify-center text-gray-400">N/A</div>
                            }
                            {/* <img src={v.image} className='w-full h-[200px] object-cover' alt="Product" /> */}
                            <div className="text-center p-3 flex-1 flex flex-col justify-between">
                              <p className='py-2 text-gray-600 text-sm'>{v?.sub_category?.name || 'Product'}</p>
                              <h4 className='py-2 font-semibold'>{v.name}</h4>
                              <p className='py-2'><del className='text-gray-400'>Rs.{v.actual_price}</del> <span className='text-[#C09578] font-bold'>Rs.{v.sale_price}</span></p>
                            </div>
                          </Link>
                          <div className="flex gap-1 justify-center px-4 pb-3">
                            <button
                              onClick={(e) => handleAddToWishlist(e, v)}
                              className='text-[26px] sm:text-[30px] bg-gray-100 p-1 rounded hover:bg-[#C09578] hover:text-white cursor-pointer transition-colors'
                              aria-label="Add to wishlist"
                            >
                              <CiHeart className={isInWishlist ? 'text-red-500' : ''} />
                            </button>
                            <button
                              onClick={(e) => handleAddToCart(e, v)}
                              className='text-[14px] bg-gray-100 px-3 sm:px-4 py-1 text-gray-600 hover:bg-[#C09578] hover:text-white cursor-pointer rounded transition-colors whitespace-nowrap'>Add To Cart</button>
                          </div>
                        </div>
                      )
                    })
                    :
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center py-8">
                      <div className="flex items-center justify-center h-56">
                        <div role="status" aria-label="Loading" className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C09578]"></div>
                      </div>
                    </div>
                }
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8 mb-4 flex-wrap">
                <button
                  onClick={() => setCurrentPage(prev => (prev > 1 ? prev - 1 : 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-300 rounded hover:border-[#C09578] hover:text-[#C09578] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Previous
                </button>

                {Array.from({ length: totalPage }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-4 py-2 border-2 rounded font-semibold transition-colors ${currentPage === idx + 1
                      ? 'bg-[#C09578] text-white border-[#C09578]'
                      : 'border-gray-300 hover:border-[#C09578] hover:text-[#C09578]'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => (prev < totalPage ? prev + 1 : totalPage))}
                  disabled={currentPage === totalPage}
                  className="px-4 py-2 border-2 border-gray-300 rounded hover:border-[#C09578] hover:text-[#C09578] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div >
      </div >

      <div className="border border-gray-200 my-3"></div>
    </>
  )
}


