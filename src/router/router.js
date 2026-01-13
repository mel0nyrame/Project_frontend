import {createRouter,createWebHashHistory} from 'vue-router'
import Button from '../components/Button.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            component:Button
        },
    ]
})

export default router