import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Left from './leftside/Left.jsx'
import Layout from './homeP/Layout.jsx'
import AddColor from './Page/color/AddColor.jsx'
import ViewColor from './Page/color/ViewColor.jsx'
import UpdateColor from './Page/color/UpdateColor.jsx'
import Users from './Page/user/Users.jsx'
import AMaterials from './Page/Materials/AddMaterials.jsx'
import VMaterials from './Page/Materials/ViewMaterials.jsx'
import ContactEnq from './Page/Enquirys/ContactEnq.jsx'
import ACategorys from './Page/parent-Categorys/AddCategorys.jsx'
import VCategorys from './Page/parent-Categorys/ViewCategorys.jsx'
import AProducts from './Page/products/AddProducts.jsx'
import VProducts from './Page/products/ViewProducts.jsx'
import ASCategorys from './Page/sub-categorys/AddSubCategorys.jsx'
import VSCategorys from './Page/sub-categorys/ViewSubCategorys.jsx'
import ASSCategorys from './Page/sub-sub-categorys/AddSubSubCategorys.jsx'
import VSSCategorys from './Page/sub-sub-categorys/ViewSubSubCategorys.jsx'
import News from './Page/Enquirys/Newsletters.jsx'
import Whyadd from './Page/why-choose-us/whyadd.jsx'
import Whyview from './Page/why-choose-us/whyview.jsx'
import Orders from './Page/orders/Orders.jsx'
import ASliders from './Page/sliders/AddSliders.jsx'
import VSliders from './Page/sliders/ViewSliders.jsx'
import ACountry from './Page/country/AddCountry.jsx'
import VCountry from './Page/country/ViewCountry.jsx'
import AddTestimonials from './Page/testimonials/AddTestimonials.jsx'
import ViewTestimonials from './Page/testimonials/ViewTestimonials.jsx'
import AddFaqs from './Page/faqs/AddFaqs.jsx'
import ViewFaqs from './Page/faqs/ViewFaqs.jsx'
import AddCountry from './Page/country/AddCountry.jsx'
import ViewCountry from './Page/country/ViewCountry.jsx'
import AddMaterials from './Page/Materials/AddMaterials.jsx'
import ViewMaterials from './Page/Materials/ViewMaterials.jsx'
import AddSliders from './Page/sliders/AddSliders.jsx'
import ViewSliders from './Page/sliders/ViewSliders.jsx'
import AddCategorys from './Page/parent-Categorys/AddCategorys.jsx'
import ViewCategorys from './Page/parent-Categorys/ViewCategorys.jsx'
import AddSubCategorys from './Page/sub-categorys/AddSubCategorys.jsx'
import ViewSubCategorys from './Page/sub-categorys/ViewSubCategorys.jsx'
import AddSubSubCategorys from './Page/sub-sub-categorys/AddSubSubCategorys.jsx'
import ViewSubSubCategorys from './Page/sub-sub-categorys/ViewSubSubCategorys.jsx'
import AddProducts from './Page/products/AddProducts.jsx'
import ViewProducts from './Page/products/ViewProducts.jsx'
import NewsLettters from './Page/Enquirys/Newsletters.jsx'
import Newsletters from './Page/Enquirys/Newsletters.jsx'
import Dashboard from './Page/Dashbord.jsx'
import Profile from './Page/Profile.jsx'
import CompanyProfile from './Page/CompanyProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route element={<Layout />} >
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path='Profile' element={<Profile />} />
          <Route path='Company-Profile' element={<CompanyProfile/>} />


          <Route path='user' element={<Users />} />

          <Route path="color" >
            <Route path='add' element={<AddColor />} />
            <Route path='view' element={<ViewColor />} />
            <Route path='update/:id' element={<UpdateColor />} />

          </Route>

          <Route path="Materials" >
            <Route path='add' element={<AddMaterials />} />
            <Route path='view' element={<ViewMaterials />} />
            <Route path='update/:id' element={<AddMaterials />} />

          </Route>

          <Route path="enquiry" >
            <Route path='' element={<ContactEnq />} />
            <Route path='' element={<Newsletters/>} />
            <Route path='update/:id' element={<ContactEnq />} />

          </Route>

          <Route path="parent-Categorys" >
            <Route path='add' element={<AddCategorys />} />
            <Route path='view' element={<ViewCategorys />} />
            <Route path='update/:id' element={<AddCategorys />} />

          </Route>

          <Route path="sub-categorys" >
            <Route path='add' element={<AddSubCategorys />} />
            <Route path='view' element={<ViewSubCategorys />} />
            <Route path='update/:id' element={<AddSubCategorys />} />

          </Route>

          <Route path="sub-sub-categorys" >
            <Route path='add' element={<AddSubSubCategorys />} />
            <Route path='view' element={<ViewSubSubCategorys />} />
            <Route path='update/:id' element={<AddSubSubCategorys />} />

          </Route>

          <Route path="products" >
            <Route path='add' element={<AddProducts/>} />
            <Route path='view' element={<ViewProducts />} />
            <Route path='update/:id' element={<AddProducts />} />

          </Route>

          <Route path="why-choose-us" >
            <Route path='add' element={<Whyadd />} />
            <Route path='view' element={<Whyview />} />
            <Route path='update/:id' element={<Whyadd />} />

          </Route>

          <Route path="orders" >
            <Route path='' element={<Orders />} />
          </Route>

          <Route path="sliders" >
            <Route path='add' element={<AddSliders />} />
            <Route path='view' element={<ViewSliders />} />
            <Route path='update/:id' element={<AddSliders  />} />

          </Route>
          <Route path="country" >
            <Route path='add' element={<AddCountry />} />
            <Route path='view' element={<ViewCountry />} />
            <Route path='update/:id' element={<AddCountry />} />

          </Route>

           <Route path="testimonials" >
            <Route path='add' element={<AddTestimonials />} />
            <Route path='view' element={<ViewTestimonials />} />
            <Route path='update/:id' element={<AddTestimonials />} />

          </Route>

             <Route path="faqs" >
            <Route path='add' element={<AddFaqs />} />
            <Route path='view' element={<ViewFaqs/>} />
            <Route path='update/:id' element={<AddFaqs />} />

          </Route>


        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
