import {createRouter,createWebHashHistory} from 'vue-router'
import Button from '../components/Button.vue'
import Table from '../components/Table.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            component:Button
        },
        {
            path:"/table",
            component:Table
        }
    ]
})

export default router