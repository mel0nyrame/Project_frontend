<template>
    <div class="card">
        <DataTable 
            v-model:editingRows="editingRows" 
            :value="courses" 
            editMode="row" 
            dataKey="courseId" 
            @row-edit-save="onRowEditSave"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            :pt="{
                column: {
                    bodycell: ({ state }) => ({
                        style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem'
                    })
                }
            }"
        >
            <Column field="courseId" header="课程编号" style="width: 60%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="courseName" header="课程名称" style="width: 50%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCourseList, updateCourse } from '../api/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

const courses = ref([]);
const editingRows = ref([]);

onMounted(async () => {
    try {
        const res = await getCourseList();
        courses.value = res.data?.data || [];
    } catch (error) {
        console.error('获取课程列表失败:', error);
        courses.value = [];
    }
});

const onRowEditSave = async (event) => {
    const { newData, index } = event;
    try {
        await updateCourse(newData.courseId, newData);
        courses.value[index] = newData;
        console.log('更新成功:', newData);
    } catch (error) {
        console.error('更新课程信息失败:', error);
        alert('更新失败: ' + (error.response?.data?.msg || error.message));
        
        const res = await getCourseList();
        courses.value = res.data?.data || [];
    }
};
</script>