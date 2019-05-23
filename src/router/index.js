// import Home from '../views/home';
// import Page1 from '../views/page1';
// import Page2 from '../views/page2';
import loadable from "@loadable/component";
const router = [{
        path: "/home",
        component: loadable(() => import('../views/home'))
    },
    {
        path: "/page1",
        component: loadable(() => import("../views/page1"))
    },
    {
        path: "/page2",
        component: loadable(() => import("../views/page2"))
    }
];

export default router;