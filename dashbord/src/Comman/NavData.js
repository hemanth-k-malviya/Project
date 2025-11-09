import { AiFillBank } from 'react-icons/ai';
import { CgTimer } from 'react-icons/cg';
import { FaEnvelope, FaShoppingCart, FaSlidersH, FaGlobe, FaComment, FaQuestion, FaFileAlt, FaUser, FaExpandArrowsAlt, FaLocationArrow, FaUserEdit } from 'react-icons/fa';
import { FaBarsStaggered, FaDroplet, FaSliders } from 'react-icons/fa6';
import { FcFaq } from 'react-icons/fc';
import { LuNotebookPen } from 'react-icons/lu';
import { MdShoppingBag } from 'react-icons/md';
import { PiRadioButtonDuotone } from 'react-icons/pi';


export const Nav = [
    {
        id: 1,
        title: "Users",
        icon: FaUser,
        subMenu: [

            { subTitle: "View Users", subIcon: PiRadioButtonDuotone, link: "/user" }
        ]
    },
    {
        id: 2,
        title: "Enquiries",
        icon: FaEnvelope,
        subMenu: [

            { subTitle: "Contact Enquiries", subIcon: PiRadioButtonDuotone, link: "/enquiry" },
            { subTitle: "Newsletters", subIcon: PiRadioButtonDuotone  ,link: "/newsletters" }
        ]
    },
    {
        id: 3,
        title: "Colors",
        icon: FaDroplet,
        subMenu: [

            { subTitle: "Add Colors", subIcon: PiRadioButtonDuotone, link: "/color/add" },
            { subTitle: "View Colors", subIcon: PiRadioButtonDuotone, link: "/color/view" }
        ]
    },
    {
        id: 4,
        title: "Materials",
        icon: FaExpandArrowsAlt,
        subMenu: [

            { subTitle: "Add Materials", subIcon: PiRadioButtonDuotone, link: "/material/add" },
            { subTitle: "View Materials", subIcon: PiRadioButtonDuotone, link: "/material/view" }
        ]
    },

    {
        id: 5,
        title: "Parent Categories",
        icon: FaBarsStaggered,
        subMenu: [

            { subTitle: "Add Categories", subIcon: PiRadioButtonDuotone, link: "/parent-category/add" },
            { subTitle: "View Categories", subIcon: PiRadioButtonDuotone, link: "/parent-category/view" }
        ]
    },
    {
        id: 6,
        title: "Sub Categorys",
        icon: FaBarsStaggered,
        subMenu: [

            { subTitle: "Add Sub Categories", subIcon: PiRadioButtonDuotone, link: "/sub-categorys/add" },
            { subTitle: "View Sub Categories", subIcon: PiRadioButtonDuotone, link: "/sub-categorys/view" }
        ]
    },
    {
        id: 7,
        title: "Sub Sub Categories",
        icon: FaBarsStaggered,
        subMenu: [

            { subTitle: "Add Sub Categories", subIcon: PiRadioButtonDuotone, link: "/sub-sub-categorys/add" },
            { subTitle: "View Sub Categories", subIcon: PiRadioButtonDuotone, link: "/sub-sub-categorys/view" }
        ]
    },
    {
        id: 8,
        title: "Products",
        icon: MdShoppingBag,
        subMenu: [

            { subTitle: "Add Products", subIcon: PiRadioButtonDuotone , link: "/products/add" },
            { subTitle: "View Products", subIcon: PiRadioButtonDuotone , link: "/products/view"}
        ]
    },
    {
        id: 9,
        title: "Why Choose Us",
        icon: CgTimer,
        subMenu: [

            { subTitle: "Add Why Choose Us", subIcon: PiRadioButtonDuotone , link: "/why-choose-us/add" },
            { subTitle: "View Why Choose Us", subIcon: PiRadioButtonDuotone , link: "/why-choose-us/view"}
        ]
    },
    {
        id: 10,
        title: "Orders",
        icon: LuNotebookPen,
        subMenu: [

            { subTitle: "Orders", subIcon: PiRadioButtonDuotone , link: "/Orders" }
        ]
    },
    {
        id: 11,
        title: "Sliders",
        icon: FaSliders,
        subMenu: [

            { subTitle: "Add Sliders", subIcon: PiRadioButtonDuotone ,link: "/Sliders/add" },
            { subTitle: "View Sliders", subIcon: PiRadioButtonDuotone ,link: "/Sliders/view" }
        ]
    },
    {
        id: 12,
        title: "Country",
        icon: FaLocationArrow,
        subMenu: [

            { subTitle: "Add Country", subIcon: PiRadioButtonDuotone ,link: "/Country/add" },
            { subTitle: "View Country", subIcon: PiRadioButtonDuotone,link: "/Country/view" }
        ]
    },
    {
        id: 13,
        title: "Testimonials",
        icon: FaUserEdit,
        subMenu: [

            { subTitle: "Add Testimonials", subIcon: PiRadioButtonDuotone ,link: "/Testimonials/add"},
            { subTitle: "View Testimonials", subIcon: PiRadioButtonDuotone ,link: "/Testimonials/view"}
        ]
    },
    {
        id: 14,
        title: "Faqs",
        icon: FcFaq,
        subMenu: [

            { subTitle: "Add Faqs", subIcon: PiRadioButtonDuotone ,link: "/Faqs/add"  },
            { subTitle: "View Faqs", subIcon: PiRadioButtonDuotone ,link: "/Faqs/view" }
        ]
    },
    {
        id: 15,
        title: "Terms & Conditions",
        icon: FaFileAlt,
        subMenu: [

        ]
    }
];

