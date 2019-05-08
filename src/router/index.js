import Home from '../views/home';
import Page1 from '../views/page1';
import Page2 from '../views/page2';

const router = [{
        path: "/home",
        component: Home
    },
    {
        path: "/page1",
        component: Page1
    },
    {
        path: "/page2",
        component: Page2
    }
];

export default router;